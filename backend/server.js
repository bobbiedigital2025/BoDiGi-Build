import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { timingSafeEqual } from 'crypto';
import {
  deploymentSkillIds,
  getSkillsCatalog,
  initializeSkillsCatalog,
  invokeSkill,
} from './skillsCatalog.js';
import {
  getDeploymentProfiles,
  resolvePreferredDeploymentProfile,
} from './deploymentProfiles.js';
import { mcpCoordinator } from './mcpCoordinator.js';

const app = express();
const PORT = process.env.PORT || 4000;
const AGENT_API_TOKEN = process.env.AGENT_API_TOKEN || '';
const startupCatalog = initializeSkillsCatalog();

if (startupCatalog.warning) {
  console.warn(startupCatalog.warning);
} else {
  console.log(`Skills catalog loaded (${startupCatalog.skills.length} skills, ${startupCatalog.gates.length} gates).`);
}

if (!AGENT_API_TOKEN) {
  console.warn('AGENT_API_TOKEN is not set; agent skill APIs are running without token auth.');
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json({ limit: '100kb' }));

function requireAgentApiToken(req, res, next) {
  if (!AGENT_API_TOKEN) {
    return next();
  }

  const providedToken = req.header('x-agent-api-token') || '';
  const expectedTokenBuffer = Buffer.from(AGENT_API_TOKEN, 'utf8');
  const providedTokenBuffer = Buffer.from(providedToken, 'utf8');
  const maxLength = Math.max(expectedTokenBuffer.length, providedTokenBuffer.length, 1);
  const paddedExpectedToken = Buffer.alloc(maxLength);
  const paddedProvidedToken = Buffer.alloc(maxLength);
  expectedTokenBuffer.copy(paddedExpectedToken);
  providedTokenBuffer.copy(paddedProvidedToken);

  const tokensMatch = timingSafeEqual(paddedExpectedToken, paddedProvidedToken);
  const isValidToken = tokensMatch && expectedTokenBuffer.length === providedTokenBuffer.length;

  if (!isValidToken) {
    res.set('WWW-Authenticate', 'Token realm="agent-api"');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check — used by Render to verify the service is live
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API root
app.get('/', (_req, res) => {
  res.json({
    name: 'BoDiGi-Build API',
    version: '1.0.0',
    docs: 'https://github.com/bobbiedigital2025/BoDiGi-Build',
  });
});

// Agent status endpoint (placeholder for MCP / A2A integration)
app.get('/api/agent/status', (_req, res) => {
  const catalog = getSkillsCatalog();
  const observability = mcpCoordinator.getObservability();

  res.json({
    agent: 'Boltz',
    status: 'ready',
    mcp: true,
    a2a: true,
    mcpDiscovery: true,
    mcpAutoFetch: true,
    a2aHandoffs: true,
    skillsLoaded: catalog.skills.length,
    gatesLoaded: catalog.gates.length,
    skillsCatalogHealthy: !catalog.warning,
    mcpServersOnline: observability.servers.online,
    mcpServersTotal: observability.servers.total,
  });
});

// Agent skills catalog endpoint
app.get('/api/agent/skills', requireAgentApiToken, (_req, res) => {
  const catalog = getSkillsCatalog();

  res.json({
    loadedAt: catalog.loadedAt,
    warning: catalog.warning,
    gates: catalog.gates,
    skills: catalog.skills,
  });
});

// Agent skill invoke endpoint
app.post('/api/agent/skills/:skillId/invoke', requireAgentApiToken, (req, res) => {
  const { skillId } = req.params;
  const incomingPayload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const catalog = getSkillsCatalog();
  const skill = catalog.skills.find((entry) => entry.id === skillId);
  const allowedFields = new Set([
    ...(skill?.inputs || []),
    'completedSkills',
    'approvalGates',
  ]);
  if (deploymentSkillIds.has(skillId)) {
    allowedFields.add('deployment_profile');
    allowedFields.add('mcp_version');
  }
  const payload = {};

  for (const fieldName of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(incomingPayload, fieldName)) {
      payload[fieldName] = incomingPayload[fieldName];
    }
  }

  const result = invokeSkill(skillId, payload);

  if (!result.ok) {
    return res.status(result.statusCode || 400).json(result);
  }

  return res.json(result);
});

// Deployment profile endpoint
app.get('/api/agent/deployment/profiles', requireAgentApiToken, (req, res) => {
  const requestedProfileId = req.query.profile || '';
  const selected = resolvePreferredDeploymentProfile(requestedProfileId);

  res.json({
    mode: selected.mode,
    selectedProfileId: selected.profile?.id,
    selectedProfileSource: selected.source,
    mcpVersion: selected.profile?.mcpVersion || '2',
    defaultProfileId: selected.defaultProfileId,
    profiles: getDeploymentProfiles(),
  });
});

// MCP discovery endpoint
app.get('/api/agent/mcp/discovery', requireAgentApiToken, (req, res) => {
  const includeUnhealthy = String(req.query.includeUnhealthy || '').toLowerCase() === 'true';
  const capability = typeof req.query.capability === 'string' ? req.query.capability : '';
  const discovery = mcpCoordinator.discoverServers({ capability, includeUnhealthy });
  return res.json(discovery);
});

// MCP server registration endpoint
app.post('/api/agent/mcp/servers/register', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.registerServer(payload, { source: 'api' });
  if (!result.ok) {
    return res.status(400).json(result);
  }
  return res.status(result.created ? 201 : 200).json(result);
});

// MCP server health update endpoint
app.post('/api/agent/mcp/servers/:serverId/health', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.updateServerHealth(req.params.serverId, payload);
  if (!result.ok) {
    return res.status(result.code === 'SERVER_NOT_FOUND' ? 404 : 400).json(result);
  }
  return res.json(result);
});

// MCP server selection endpoint with failover hints
app.get('/api/agent/mcp/servers/select', requireAgentApiToken, (req, res) => {
  const capability = typeof req.query.capability === 'string' ? req.query.capability : '';
  const rawExclude = typeof req.query.exclude === 'string' ? req.query.exclude : '';
  const excludeServerIds = rawExclude
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const selection = mcpCoordinator.selectServer({ capability, excludeServerIds });
  if (!selection.ok) {
    return res.status(503).json(selection);
  }
  return res.json(selection);
});

// MCP auto-fetch endpoint
app.post('/api/agent/mcp/auto-fetch', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.autoFetch({
    resourceKey: payload.resourceKey,
    capability: payload.capability,
    forceRefresh: payload.forceRefresh === true,
    ttlMs: Number.parseInt(payload.ttlMs, 10) || 0,
    allowStaleOnFailure: payload.allowStaleOnFailure !== false,
  });
  if (!result.ok) {
    return res.status(503).json(result);
  }
  return res.json(result);
});

// A2A handoff create endpoint
app.post('/api/agent/a2a/handoffs', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.createHandoff(payload);
  if (!result.ok) {
    const statusCode = result.code === 'CONTEXT_TOO_LARGE' ? 413 : 400;
    return res.status(statusCode).json(result);
  }
  return res.status(201).json(result);
});

// A2A handoff read endpoint
app.get('/api/agent/a2a/handoffs/:handoffId', requireAgentApiToken, (req, res) => {
  const result = mcpCoordinator.getHandoff(req.params.handoffId);
  if (!result.ok) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

// A2A handoff accept endpoint
app.post('/api/agent/a2a/handoffs/:handoffId/accept', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.acceptHandoff(req.params.handoffId, payload);
  if (!result.ok) {
    if (result.code === 'HANDOFF_NOT_FOUND') {
      return res.status(404).json(result);
    }
    return res.status(403).json(result);
  }
  return res.json(result);
});

// A2A handoff resume endpoint
app.post('/api/agent/a2a/handoffs/:handoffId/resume', requireAgentApiToken, (req, res) => {
  const payload = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const result = mcpCoordinator.resumeHandoff(req.params.handoffId, payload);
  if (!result.ok) {
    if (result.code === 'HANDOFF_NOT_FOUND') {
      return res.status(404).json(result);
    }
    if (result.code === 'INVALID_RESUME_TOKEN') {
      return res.status(401).json(result);
    }
    return res.status(403).json(result);
  }
  return res.json(result);
});

// Observability endpoint
app.get('/api/agent/observability', requireAgentApiToken, (_req, res) => {
  res.json(mcpCoordinator.getObservability());
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`BoDiGi-Build API running on port ${PORT}`);
});

export default app;
