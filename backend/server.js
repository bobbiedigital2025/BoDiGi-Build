import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

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
  res.json({ agent: 'Boltz', status: 'ready', mcp: true, a2a: true });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`BoDiGi-Build API running on port ${PORT}`);
});

export default app;
