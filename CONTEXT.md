# CONTEXT.md — BoDiGi-Build

## What this project is

BoDiGi-Build is an AI-powered, multi-agent SaaS application builder. It uses a team of specialised
AI agents to plan, build, test, and deploy production-ready applications — with full billing,
auth, legal compliance, accessibility, and documentation built in.

## Goals

- Ship top-quality SaaS apps faster using AI agent collaboration
- Every generated app must be production-hardened, monetisable, and legally compliant
- Agents work as a professional dev team: architecture → engineering → QA → legal → deployment
- All apps include accessibility (WCAG AA), privacy policy, ToS, cookie consent, and admin features

## Repo layout

```
/
├── backend/          Node.js + Express API (Render / Docker)
├── frontend/         React + Vite + Tailwind (Netlify / Vercel)
├── supabase/
│   └── migrations/   SQL migration files (run in Supabase SQL editor)
├── docs/
│   ├── agents/       Agent config: issue-tracker, domain, triage-labels
│   └── adr/          Architecture Decision Records
├── skills.md         Multi-agent skill catalog with approval gates
├── AGENTS.md         Agent skills block (consumed by AI agents)
└── CONTEXT.md        This file
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js 18+, Express 4 |
| Auth / DB | Supabase (PostgreSQL + RLS) |
| Payments | Stripe (subscriptions, webhooks) |
| Orchestration | MCP v2, A2A handoffs |
| Automation | n8n |
| Infra | Hetzner, Vercel, Docker, Render |

## Current state

- MCP coordinator with discovery, auto-fetch, A2A handoffs: ✅ implemented
- Multi-agent skill catalog with approval gates: ✅ implemented
- Deployment profile system (vercel-docker-n8n): ✅ implemented
- Supabase schema + Stripe billing: 🚧 in progress
- Frontend checkout flow: 🚧 in progress

## Key env vars (never commit values)

See `backend/.env.example` and `frontend/.env.example`.
