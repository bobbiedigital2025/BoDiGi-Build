import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  getSkillsCatalog,
  initializeSkillsCatalog,
  invokeSkill,
} from './skillsCatalog.js';

const app = express();
const PORT = process.env.PORT || 4000;
const startupCatalog = initializeSkillsCatalog();

if (startupCatalog.warning) {
  console.warn(startupCatalog.warning);
} else {
  console.log(`Skills catalog loaded (${startupCatalog.skills.length} skills).`);
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json({ limit: '100kb' }));

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
    skillsCatalogHealthy: !catalog.warning,
  });
});

// Agent skills catalog endpoint
app.get('/api/agent/skills', (_req, res) => {
  const catalog = getSkillsCatalog();

  res.json({
    loadedAt: catalog.loadedAt,
    warning: catalog.warning,
    skills: catalog.skills,
  });
});

// Agent skill invoke endpoint
app.post('/api/agent/skills/:skillId/invoke', (req, res) => {
  const { skillId } = req.params;
  const payload = req.body || {};
  const result = invokeSkill(skillId, payload);

  if (!result.ok) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`BoDiGi-Build API running on port ${PORT}`);
});

export default app;
