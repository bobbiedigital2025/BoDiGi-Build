import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { timingSafeEqual } from 'crypto';
import {
  getSkillsCatalog,
  initializeSkillsCatalog,
  invokeSkill,
} from './skillsCatalog.js';
import {
  getDeploymentProfiles,
  resolvePreferredDeploymentProfile,
} from './deploymentProfiles.js';

const app = express();
const PORT = process.env.PORT || 4000;
const AGENT_API_TOKEN = process.env.AGENT_API_TOKEN || '';
const startupCatalog = initializeSkillsCatalog();
const deploymentSkillIds = new Set([
  'deployment-platform-agent',
  'deployment-validation-agent',
  'deployment-verification-agent',
  'n8n-automation-agent',
]);

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
  const isValidToken = expectedTokenBuffer.length === providedTokenBuffer.length
    && timingSafeEqual(expectedTokenBuffer, providedTokenBuffer);

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

  res.json({
    agent: 'Boltz',
    status: 'ready',
    mcp: true,
    a2a: true,
    skillsLoaded: catalog.skills.length,
    gatesLoaded: catalog.gates.length,
    skillsCatalogHealthy: !catalog.warning,
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
  const payload = req.body || {};

  if (deploymentSkillIds.has(skillId)) {
    const preferredDeployment = resolvePreferredDeploymentProfile(payload.deployment_profile);
    payload.deployment_profile = preferredDeployment.profile.id;
    payload.deployment_profile_mode = preferredDeployment.mode;
    payload.deployment_profile_source = preferredDeployment.source;
    payload.mcp_version = preferredDeployment.profile.mcpVersion || '2';
    payload.deployment_profile_details = preferredDeployment.profile;
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

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`BoDiGi-Build API running on port ${PORT}`);
});

export default app;
