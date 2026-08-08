import test from 'node:test';
import assert from 'node:assert/strict';
import { McpCoordinator } from './mcpCoordinator.js';

function createCoordinatorForTests() {
  return new McpCoordinator({
    cacheTtlMs: 10,
    handoffSecret: 'unit-test-secret',
    seedServers: [
      {
        id: 'primary',
        name: 'Primary',
        url: 'https://primary.local',
        status: 'online',
        priority: 100,
        capabilities: ['context-fetch'],
        resources: {
          config: { source: 'primary' },
        },
      },
      {
        id: 'secondary',
        name: 'Secondary',
        url: 'https://secondary.local',
        status: 'online',
        priority: 90,
        capabilities: ['context-fetch'],
        resources: {
          config: { source: 'secondary' },
        },
      },
    ],
  });
}

test('discovery prioritizes healthiest and highest priority servers', () => {
  const coordinator = createCoordinatorForTests();
  coordinator.updateServerHealth('primary', { status: 'degraded', error: 'latency' });
  const result = coordinator.discoverServers({ capability: 'context-fetch' });

  assert.equal(result.ok, true);
  assert.equal(result.servers.length, 2);
  assert.equal(result.servers[0].id, 'secondary');
});

test('auto-fetch falls back to secondary server when primary fails', () => {
  const coordinator = createCoordinatorForTests();
  coordinator.registerServer({
    id: 'primary',
    name: 'Primary',
    url: 'https://primary.local',
    status: 'online',
    priority: 100,
    capabilities: ['context-fetch'],
    resources: {},
  });

  const result = coordinator.autoFetch({
    resourceKey: 'config',
    capability: 'context-fetch',
    forceRefresh: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.source, 'network');
  assert.equal(result.serverId, 'secondary');
  assert.equal(result.attempts.length, 1);
  assert.equal(result.attempts[0].serverId, 'primary');
});

test('auto-fetch returns stale cache when all servers fail', async () => {
  const coordinator = createCoordinatorForTests();
  const initial = coordinator.autoFetch({
    resourceKey: 'config',
    capability: 'context-fetch',
    forceRefresh: true,
  });
  assert.equal(initial.ok, true);

  coordinator.registerServer({
    id: 'primary',
    name: 'Primary',
    url: 'https://primary.local',
    status: 'online',
    priority: 100,
    capabilities: ['context-fetch'],
    resources: {},
  });
  coordinator.registerServer({
    id: 'secondary',
    name: 'Secondary',
    url: 'https://secondary.local',
    status: 'online',
    priority: 90,
    capabilities: ['context-fetch'],
    resources: {},
  });

  await new Promise((resolve) => setTimeout(resolve, 11));
  const stale = coordinator.autoFetch({
    resourceKey: 'config',
    capability: 'context-fetch',
    forceRefresh: true,
    allowStaleOnFailure: true,
  });

  assert.equal(stale.ok, true);
  assert.equal(stale.source, 'stale-cache');
  assert.match(stale.warning, /stale cache/i);
});

test('a2a handoff enforces ownership and resume token', () => {
  const coordinator = createCoordinatorForTests();
  const created = coordinator.createHandoff({
    fromAgent: 'planner-agent',
    toAgent: 'deploy-agent',
    trigger: 'deployment-ready',
    capability: 'deployment',
    context: { releaseId: 'r-1' },
    resumeToken: 'resume-123',
  });
  assert.equal(created.ok, true);
  assert.equal(created.handoff.status, 'pending');
  assert.ok(created.handoff.security.signature);

  const forbiddenAccept = coordinator.acceptHandoff(created.handoff.id, { agentId: 'other-agent' });
  assert.equal(forbiddenAccept.ok, false);

  const accepted = coordinator.acceptHandoff(created.handoff.id, { agentId: 'deploy-agent' });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.handoff.status, 'accepted');

  const invalidResume = coordinator.resumeHandoff(created.handoff.id, {
    agentId: 'deploy-agent',
    resumeToken: 'bad-token',
  });
  assert.equal(invalidResume.ok, false);

  const resumed = coordinator.resumeHandoff(created.handoff.id, {
    agentId: 'deploy-agent',
    resumeToken: 'resume-123',
  });
  assert.equal(resumed.ok, true);
  assert.equal(resumed.handoff.status, 'resumed');
});
