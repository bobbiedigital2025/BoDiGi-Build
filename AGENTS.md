# AGENTS.md — BoDiGi-Build

This file is read by AI agents (GitHub Copilot, Claude, GPT, etc.) working in this repository.
It describes the project context, conventions, and the agent skill system.

## Project overview

See [CONTEXT.md](./CONTEXT.md) for full project context.

**Short version:** BoDiGi-Build is an AI-powered multi-agent SaaS builder. Backend is
Node.js + Express (ES modules). Frontend is React + Vite + Tailwind. Auth/DB is Supabase.
Payments are Stripe. Orchestration is MCP v2 + A2A.

## Working conventions

- Backend uses `"type": "module"` — always use `import`/`export`, never `require()`
- Protected routes use `x-agent-api-token` header (value from `AGENT_API_TOKEN` env var)
- Never commit `.env` files — use `.env.example` for documentation
- Secrets go in Netlify / Render / Supabase dashboards for production
- All PRs go through `engine-tools-report_progress` → `code_review` → `codeql_checker`
- Deployment profile: `vercel-docker-n8n`

## Issue tracker

See [docs/agents/issue-tracker.md](./docs/agents/issue-tracker.md).

- Tracker: **GitHub Issues**
- Repo: `bobbiedigital2025/BoDiGi-Build`
- CLI: `gh`

## Triage labels

See [docs/agents/triage-labels.md](./docs/agents/triage-labels.md).

`needs-triage` → `needs-info` | `ready-for-agent` | `ready-for-human` | `wontfix`

## Domain docs

See [docs/agents/domain.md](./docs/agents/domain.md).

Single-context repo. Context files: `CONTEXT.md`, `docs/adr/`, `docs/agents/`, `skills.md`.

## Agent skills block

Skills are defined in [skills.md](./skills.md) and enforced by the backend at
`POST /api/agent/skills/:skillId/invoke`.

Key skill IDs (invoke via API):

| Skill ID | Role |
|---|---|
| `orchestrator-agent` | Plans, sequences, and gates all agent work |
| `backend-lead` | Node/Express/Supabase schema and API |
| `frontend-lead` | React/Vite/Tailwind UI |
| `devops-lead` | Docker, Render, Vercel, n8n deployment |
| `qa-test-agent` | Testing, coverage, accessibility |
| `security-agent` | Auth, RLS, secrets, OWASP |
| `legal-compliance-agent` | ToS, Privacy Policy, GDPR |
| `monetization-agent` | Stripe billing, plans, webhooks |
| `deployment-validation-agent` | Pre/post deploy checks |
| `saas-product-ops-agent` | SaaS delivery baseline |

Full catalog: see `skills.md`.

## Architecture Decision Records

ADRs live in `docs/adr/`. Create one for any significant architecture decision using:

```
docs/adr/NNNN-short-title.md
```
