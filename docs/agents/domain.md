# Domain

## Project

BoDiGi-Build — an AI-powered, multi-agent SaaS application builder.

## What it does

BoDiGi-Build enables users to build production-ready SaaS applications using a team of AI agents
with specialised roles (engineering, DevOps, architecture, QA, legal, security, monetisation).
It combines voice/text prompting, drag-and-drop editing, MCP workflows, Supabase auth/data,
and Stripe billing to ship apps in record time.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS (deployed on Netlify / Vercel)
- **Backend**: Node.js + Express (deployed on Render / Docker)
- **Database / Auth**: Supabase (PostgreSQL + RLS)
- **Payments**: Stripe (subscriptions + webhooks)
- **Orchestration**: MCP (Model Context Protocol) v2 + A2A handoffs
- **Automation**: n8n workflow hooks
- **Infrastructure**: Hetzner server, Vercel, Docker

## Context layout

Single-context repo. All context lives in:

- `CONTEXT.md` — high-level project context (this repo root)
- `docs/adr/` — Architecture Decision Records
- `docs/agents/` — agent configuration files (this folder)
- `skills.md` — agent skill catalog
- `README.md` — public-facing documentation

## Key conventions

- Backend uses ES modules (`"type": "module"`)
- All `/api/agent/*` routes require `x-agent-api-token` header
- Deployment profile: `vercel-docker-n8n` (default)
- MCP protocol version: 2
- Skills are gated by approval gates (Gate 0–5) defined in `skills.md`
