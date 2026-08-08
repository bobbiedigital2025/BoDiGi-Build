import { createHash, createHmac } from 'crypto';

const DEFAULT_CACHE_TTL_MS = 60_000;
const MAX_CONTEXT_BYTES = 50_000;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function asString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toIsoTimestamp(now = Date.now()) {
  return new Date(now).toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCapabilities(capabilities) {
  if (!Array.isArray(capabilities)) {
    return [];
  }
  return [...new Set(capabilities.map((item) => asString(item)).filter(Boolean))];
}

function computePriorityScore(server) {
  const statusBonus = server.status === 'online' ? 30 : server.status === 'degraded' ? 10 : -20;
  return (server.priority * 2) + server.healthScore + statusBonus - (server.failureCount * 5);
}

function createDefaultServers() {
  return [
    {
      id: 'mcp-primary',
      name: 'Primary MCP Runtime',
      url: 'https://mcp-primary.local',
      priority: 100,
      status: 'online',
      mcpVersion: process.env.MCP_PROTOCOL_VERSION || '2',
      capabilities: ['skills', 'deployment', 'context-fetch'],
      resources: {
        deployment_baseline: {
          profile: 'vercel-docker-n8n',
          defaults: ['mcp-2', 'a2a', 'rollback'],
        },
      },
    },
    {
      id: 'mcp-failover',
      name: 'Failover MCP Runtime',
      url: 'https://mcp-failover.local',
      priority: 80,
      status: 'degraded',
      mcpVersion: process.env.MCP_PROTOCOL_VERSION || '2',
      capabilities: ['skills', 'context-fetch'],
      resources: {
        deployment_baseline: {
          profile: 'vercel-managed',
          defaults: ['mcp-2', 'a2a'],
        },
      },
    },
  ];
}

function parseSeedServers() {
  const raw = asString(process.env.MCP_DISCOVERY_SEED);
  if (!raw) {
    return createDefaultServers();
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : createDefaultServers();
  } catch {
    return createDefaultServers();
  }
}

export class McpCoordinator {
  constructor({
    cacheTtlMs = parsePositiveInt(process.env.MCP_AUTO_FETCH_TTL_MS, DEFAULT_CACHE_TTL_MS),
    handoffSecret = asString(process.env.A2A_HANDOFF_SECRET),
    seedServers = parseSeedServers(),
  } = {}) {
    this.cacheTtlMs = cacheTtlMs;
    this.handoffSecret = handoffSecret;
    this.servers = new Map();
    this.cache = new Map();
    this.handoffs = new Map();
    this.metrics = {
      discovery: { requests: 0, success: 0, failures: 0 },
      lifecycle: { registered: 0, healthUpdated: 0, failedSelections: 0, failovers: 0 },
      autoFetch: { requests: 0, cacheHits: 0, networkFetches: 0, staleFallbacks: 0, failures: 0 },
      handoff: { created: 0, accepted: 0, resumed: 0, rejected: 0 },
    };

    for (const server of seedServers) {
      this.registerServer(server, { source: 'seed' });
    }
  }

  track(domain, key) {
    if (!this.metrics[domain]) {
      return;
    }
    this.metrics[domain][key] = (this.metrics[domain][key] || 0) + 1;
  }

  validateServerDefinition(server = {}) {
    const id = asString(server.id);
    const name = asString(server.name) || id;
    const url = asString(server.url);
    const status = asString(server.status).toLowerCase() || 'online';

    if (!id) {
      return { ok: false, error: 'Server id is required.' };
    }
    if (!url) {
      return { ok: false, error: `Server '${id}' is missing url.` };
    }

    let parsedUrl = null;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { ok: false, error: `Server '${id}' has invalid url.` };
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { ok: false, error: `Server '${id}' must use http or https url.` };
    }

    if (!['online', 'degraded', 'offline'].includes(status)) {
      return { ok: false, error: `Server '${id}' has unsupported status '${status}'.` };
    }

    return {
      ok: true,
      value: {
        id,
        name,
        url: parsedUrl.toString(),
        status,
        priority: parsePositiveInt(server.priority, 50),
        healthScore: parsePositiveInt(server.healthScore, status === 'online' ? 100 : 70),
        failureCount: parsePositiveInt(server.failureCount, 0) - 1 < 0 ? 0 : parsePositiveInt(server.failureCount, 0),
        mcpVersion: asString(server.mcpVersion) || (process.env.MCP_PROTOCOL_VERSION || '2'),
        capabilities: normalizeCapabilities(server.capabilities),
        resources: server.resources && typeof server.resources === 'object' ? clone(server.resources) : {},
        registeredAt: server.registeredAt || toIsoTimestamp(),
        lastSeenAt: server.lastSeenAt || toIsoTimestamp(),
        lastError: asString(server.lastError),
      },
    };
  }

  sanitizeServer(server) {
    return {
      id: server.id,
      name: server.name,
      url: server.url,
      status: server.status,
      priority: server.priority,
      healthScore: server.healthScore,
      failureCount: server.failureCount,
      mcpVersion: server.mcpVersion,
      capabilities: server.capabilities,
      registeredAt: server.registeredAt,
      lastSeenAt: server.lastSeenAt,
      lastError: server.lastError || '',
    };
  }

  registerServer(server, { source = 'manual' } = {}) {
    const validation = this.validateServerDefinition(server);
    if (!validation.ok) {
      this.track('discovery', 'failures');
      return { ok: false, code: 'INVALID_SERVER', error: validation.error };
    }

    const existing = this.servers.get(validation.value.id);
    const next = {
      ...(existing || {}),
      ...validation.value,
      source,
      updatedAt: toIsoTimestamp(),
    };
    this.servers.set(next.id, next);
    this.track('lifecycle', 'registered');
    this.track('discovery', 'success');
    return { ok: true, created: !existing, server: this.sanitizeServer(next) };
  }

  updateServerHealth(serverId, { status, error = '', latencyMs = 0 } = {}) {
    const id = asString(serverId);
    const server = this.servers.get(id);
    if (!server) {
      this.track('lifecycle', 'failedSelections');
      return { ok: false, code: 'SERVER_NOT_FOUND', error: `Unknown server: ${id}` };
    }

    const nextStatus = asString(status).toLowerCase();
    if (!['online', 'degraded', 'offline'].includes(nextStatus)) {
      return { ok: false, code: 'INVALID_STATUS', error: 'Status must be online, degraded, or offline.' };
    }

    server.status = nextStatus;
    server.lastSeenAt = toIsoTimestamp();
    server.lastError = asString(error);
    if (nextStatus === 'online') {
      server.failureCount = 0;
      server.healthScore = Math.min(100, server.healthScore + 10);
    } else if (nextStatus === 'degraded') {
      server.failureCount += 1;
      server.healthScore = Math.max(20, server.healthScore - 15);
    } else {
      server.failureCount += 1;
      server.healthScore = Math.max(0, server.healthScore - 30);
    }
    if (latencyMs > 0 && latencyMs > 2_000) {
      server.healthScore = Math.max(0, server.healthScore - 5);
    }
    server.updatedAt = toIsoTimestamp();
    this.track('lifecycle', 'healthUpdated');
    return { ok: true, server: this.sanitizeServer(server) };
  }

  discoverServers({ capability = '', includeUnhealthy = false } = {}) {
    this.track('discovery', 'requests');
    const requestedCapability = asString(capability);
    const candidates = [...this.servers.values()].filter((server) => {
      if (!includeUnhealthy && server.status === 'offline') {
        return false;
      }
      if (!requestedCapability) {
        return true;
      }
      return server.capabilities.includes(requestedCapability);
    });

    const ranked = candidates
      .map((server) => ({
        ...server,
        priorityScore: computePriorityScore(server),
      }))
      .sort((left, right) => right.priorityScore - left.priorityScore);

    return {
      ok: true,
      discoveredAt: toIsoTimestamp(),
      capability: requestedCapability || null,
      total: ranked.length,
      servers: ranked.map((server) => ({
        ...this.sanitizeServer(server),
        priorityScore: server.priorityScore,
      })),
    };
  }

  selectServer({ capability = '', excludeServerIds = [] } = {}) {
    const discovery = this.discoverServers({ capability, includeUnhealthy: false });
    const excluded = new Set((excludeServerIds || []).map((entry) => asString(entry)).filter(Boolean));
    const available = discovery.servers.filter((server) => !excluded.has(server.id));

    if (available.length === 0) {
      this.track('lifecycle', 'failedSelections');
      return {
        ok: false,
        code: 'NO_SERVER_AVAILABLE',
        error: capability
          ? `No MCP server available for capability '${capability}'.`
          : 'No MCP server available.',
      };
    }

    const selected = available[0];
    return {
      ok: true,
      server: selected,
      fallbacks: available.slice(1).map((server) => server.id),
    };
  }

  fetchResourceFromServer(serverId, resourceKey) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server '${serverId}' was not found.`);
    }

    const key = asString(resourceKey);
    if (!key) {
      throw new Error('resourceKey is required.');
    }

    const payload = server.resources[key];
    if (payload === undefined) {
      throw new Error(`Resource '${key}' is unavailable on server '${server.id}'.`);
    }

    return clone(payload);
  }

  autoFetch({
    resourceKey,
    capability = '',
    forceRefresh = false,
    ttlMs = 0,
    allowStaleOnFailure = true,
  } = {}) {
    this.track('autoFetch', 'requests');
    const key = asString(resourceKey);
    if (!key) {
      this.track('autoFetch', 'failures');
      return { ok: false, code: 'INVALID_RESOURCE_KEY', error: 'resourceKey is required.' };
    }

    const cacheTtlMs = ttlMs > 0 ? ttlMs : this.cacheTtlMs;
    const cacheKey = `${asString(capability) || 'default'}::${key}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (!forceRefresh && cached && cached.expiresAt > now) {
      this.track('autoFetch', 'cacheHits');
      return {
        ok: true,
        source: 'cache',
        resourceKey: key,
        capability: asString(capability) || null,
        serverId: cached.serverId,
        fetchedAt: toIsoTimestamp(cached.fetchedAt),
        expiresAt: toIsoTimestamp(cached.expiresAt),
        data: clone(cached.data),
      };
    }

    const excluded = [];
    const attempts = [];

    while (true) {
      const selection = this.selectServer({ capability, excludeServerIds: excluded });
      if (!selection.ok) {
        break;
      }

      const serverId = selection.server.id;
      try {
        const data = this.fetchResourceFromServer(serverId, key);
        const entry = {
          serverId,
          data,
          fetchedAt: now,
          expiresAt: now + cacheTtlMs,
        };
        this.cache.set(cacheKey, entry);
        this.updateServerHealth(serverId, { status: 'online' });
        this.track('autoFetch', 'networkFetches');

        return {
          ok: true,
          source: 'network',
          resourceKey: key,
          capability: asString(capability) || null,
          serverId,
          fetchedAt: toIsoTimestamp(entry.fetchedAt),
          expiresAt: toIsoTimestamp(entry.expiresAt),
          data: clone(data),
          attempts,
        };
      } catch (error) {
        excluded.push(serverId);
        this.track('lifecycle', 'failovers');
        this.updateServerHealth(serverId, {
          status: excluded.length > 1 ? 'offline' : 'degraded',
          error: error.message,
        });
        attempts.push({
          serverId,
          error: error.message,
        });
      }
    }

    if (allowStaleOnFailure && cached) {
      this.track('autoFetch', 'staleFallbacks');
      return {
        ok: true,
        source: 'stale-cache',
        resourceKey: key,
        capability: asString(capability) || null,
        serverId: cached.serverId,
        fetchedAt: toIsoTimestamp(cached.fetchedAt),
        expiresAt: toIsoTimestamp(cached.expiresAt),
        data: clone(cached.data),
        attempts,
        warning: 'Primary and fallback fetch attempts failed; stale cache returned.',
      };
    }

    this.track('autoFetch', 'failures');
    return {
      ok: false,
      code: 'AUTO_FETCH_FAILED',
      error: `Unable to fetch resource '${key}' from available MCP servers.`,
      attempts,
    };
  }

  buildHandoffSignature({ handoffId, toAgent, contextDigest }) {
    if (!this.handoffSecret) {
      return '';
    }
    return createHmac('sha256', this.handoffSecret)
      .update(`${handoffId}:${toAgent}:${contextDigest}`)
      .digest('hex');
  }

  createHandoff({
    fromAgent,
    toAgent,
    trigger,
    capability = '',
    context = {},
    resumeToken = '',
  } = {}) {
    const normalizedFromAgent = asString(fromAgent);
    const normalizedToAgent = asString(toAgent);
    const normalizedTrigger = asString(trigger);
    const normalizedCapability = asString(capability);
    const normalizedResumeToken = asString(resumeToken);

    if (!normalizedFromAgent || !normalizedToAgent || !normalizedTrigger) {
      this.track('handoff', 'rejected');
      return {
        ok: false,
        code: 'INVALID_HANDOFF',
        error: 'fromAgent, toAgent, and trigger are required.',
      };
    }

    const contextPayload = context && typeof context === 'object' && !Array.isArray(context) ? context : {};
    const serializedContext = JSON.stringify(contextPayload);
    if (Buffer.byteLength(serializedContext, 'utf8') > MAX_CONTEXT_BYTES) {
      this.track('handoff', 'rejected');
      return {
        ok: false,
        code: 'CONTEXT_TOO_LARGE',
        error: `Context exceeds ${MAX_CONTEXT_BYTES} byte limit.`,
      };
    }

    const handoffId = `handoff-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const contextDigest = createHash('sha256').update(serializedContext).digest('hex');
    const signature = this.buildHandoffSignature({
      handoffId,
      toAgent: normalizedToAgent,
      contextDigest,
    });

    const now = toIsoTimestamp();
    const handoff = {
      id: handoffId,
      fromAgent: normalizedFromAgent,
      toAgent: normalizedToAgent,
      trigger: normalizedTrigger,
      capability: normalizedCapability || null,
      status: 'pending',
      context: clone(contextPayload),
      contextDigest,
      resumeToken: normalizedResumeToken || null,
      ownership: {
        currentOwner: normalizedToAgent,
        transferredAt: now,
      },
      security: {
        signature: signature || null,
        requiresResumeToken: Boolean(normalizedResumeToken),
      },
      createdAt: now,
      updatedAt: now,
      history: [
        { at: now, event: 'created', actor: normalizedFromAgent },
      ],
    };

    this.handoffs.set(handoffId, handoff);
    this.track('handoff', 'created');
    return { ok: true, handoff: clone(handoff) };
  }

  getHandoff(handoffId) {
    const handoff = this.handoffs.get(asString(handoffId));
    if (!handoff) {
      return { ok: false, code: 'HANDOFF_NOT_FOUND', error: 'Handoff not found.' };
    }
    return { ok: true, handoff: clone(handoff) };
  }

  acceptHandoff(handoffId, { agentId = '', resumeState = {} } = {}) {
    const handoff = this.handoffs.get(asString(handoffId));
    const normalizedAgentId = asString(agentId);
    if (!handoff) {
      this.track('handoff', 'rejected');
      return { ok: false, code: 'HANDOFF_NOT_FOUND', error: 'Handoff not found.' };
    }
    if (!normalizedAgentId || normalizedAgentId !== handoff.toAgent) {
      this.track('handoff', 'rejected');
      return { ok: false, code: 'HANDOFF_FORBIDDEN', error: 'Only the receiving agent can accept this handoff.' };
    }

    const now = toIsoTimestamp();
    handoff.status = 'accepted';
    handoff.updatedAt = now;
    handoff.acceptedAt = now;
    handoff.resumeState = resumeState && typeof resumeState === 'object' ? clone(resumeState) : {};
    handoff.history.push({ at: now, event: 'accepted', actor: normalizedAgentId });
    this.track('handoff', 'accepted');
    return { ok: true, handoff: clone(handoff) };
  }

  resumeHandoff(handoffId, { agentId = '', resumeToken = '' } = {}) {
    const handoff = this.handoffs.get(asString(handoffId));
    const normalizedAgentId = asString(agentId);
    const normalizedResumeToken = asString(resumeToken);

    if (!handoff) {
      this.track('handoff', 'rejected');
      return { ok: false, code: 'HANDOFF_NOT_FOUND', error: 'Handoff not found.' };
    }
    if (!normalizedAgentId || normalizedAgentId !== handoff.toAgent) {
      this.track('handoff', 'rejected');
      return { ok: false, code: 'HANDOFF_FORBIDDEN', error: 'Only the receiving agent can resume this handoff.' };
    }
    if (handoff.resumeToken && handoff.resumeToken !== normalizedResumeToken) {
      this.track('handoff', 'rejected');
      return { ok: false, code: 'INVALID_RESUME_TOKEN', error: 'Resume token is invalid.' };
    }

    const now = toIsoTimestamp();
    handoff.status = 'resumed';
    handoff.updatedAt = now;
    handoff.resumedAt = now;
    handoff.history.push({ at: now, event: 'resumed', actor: normalizedAgentId });
    this.track('handoff', 'resumed');
    return { ok: true, handoff: clone(handoff) };
  }

  getObservability() {
    const activeServers = [...this.servers.values()];
    const activeHandoffs = [...this.handoffs.values()];
    return {
      capturedAt: toIsoTimestamp(),
      metrics: clone(this.metrics),
      servers: {
        total: activeServers.length,
        online: activeServers.filter((entry) => entry.status === 'online').length,
        degraded: activeServers.filter((entry) => entry.status === 'degraded').length,
        offline: activeServers.filter((entry) => entry.status === 'offline').length,
      },
      cache: {
        entries: this.cache.size,
        ttlMs: this.cacheTtlMs,
      },
      handoffs: {
        total: activeHandoffs.length,
        pending: activeHandoffs.filter((entry) => entry.status === 'pending').length,
        accepted: activeHandoffs.filter((entry) => entry.status === 'accepted').length,
        resumed: activeHandoffs.filter((entry) => entry.status === 'resumed').length,
      },
    };
  }
}

export const mcpCoordinator = new McpCoordinator();
