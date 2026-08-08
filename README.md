# BoDiGi-Build — AI-Powered SaaS App Builder (MCP & A2A Secure)

Welcome! This project is an AI-driven, automation-first application builder designed for speed, scalability, and secure operations using Model Context Protocol (MCP) and App-to-App (A2A) authentication.

## 🚀 Features

- Full-Stack SaaS architecture:
  - React (Vite + Tailwind) frontend — deployed on **Netlify**
  - Node.js + Express backend — deployed on **Render**
  - Supabase database & authentication
  - Stripe for subscriptions (usage-based billing)
- MCP-first workflows for secure, automated operations
- A2A token-based system connections
- Live project preview window
- VS Code-style file explorer with download as ZIP option
- Drag & Drop UI editing
- Text and voice prompts for AI-driven build control
- Usage dashboard with quotas and billing insights
- Cost-efficient, beginner-friendly setup
- `skills.md` catalog support for agent capabilities and safe skill invocation

## 📦 Folder Structure

```
/frontend        → Vite + React + Tailwind frontend (Netlify)
/backend         → Node.js + Express API (Render)
netlify.toml     → Netlify deployment configuration
render.yaml      → Render deployment configuration
.env.example     → Environment variable placeholders
README.md        → Project documentation
LICENSE.txt      → Commercial license terms
```

## ⚙️ Quick Setup

1. Clone the repo:
```bash
git clone https://github.com/bobbiedigital2025/BoDiGi-Build.git
```
2. Install dependencies:
```bash
cd frontend && npm install
cd ../backend && npm install
```
3. Copy and configure environment variables:
```bash
cp .env.example frontend/.env
cp .env.example backend/.env
```
4. Run development servers:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```
5. Access the app at `http://localhost:5173`

## 🌐 Deployment

### Frontend → Netlify
The `netlify.toml` at the root configures automatic deployment of the frontend:
- Build command: `npm run build`
- Publish directory: `frontend/dist`

### Backend → Render
The `render.yaml` at the root configures the backend web service:
- Runtime: Node.js
- Start command: `node server.js`

## 🧩 Skills Catalog (`skills.md`)

BoDiGi-Build now supports a project-level skills catalog at:

`skills.md` (project root)

At backend startup, the catalog is loaded and exposed through:

- `GET /api/agent/skills` → list loaded skills, approval gates, and metadata
- `POST /api/agent/skills/:skillId/invoke` → enforce required inputs, dependencies, and approval-gate status before returning mapped action template
- `GET /api/agent/deployment/profiles` → list deployment profiles and selected default (supports `?profile=<profileId>` override preview)

Supported multi-agent team skills:
- `chief-architect`
- `program-manager`
- `devops-sre-agent`
- `frontend-lead`
- `backend-lead`
- `code-implementer`
- `code-reviewer`
- `qa-test-agent`
- `security-agent`
- `docs-agent`
- `legal-compliance-agent`
- `analytics-agent`
- `monetization-agent`
- `admin-ops-agent`
- `saas-product-ops-agent`
- `deployment-platform-agent`
- `n8n-automation-agent`
- `deployment-validation-agent`
- `deployment-verification-agent`
- `playwright-browser-automator`

Mandatory approval gates:
- `gate-0-scope-approval`
- `gate-1-architecture-approval`
- `gate-2-build-approval`
- `gate-3-test-approval`
- `gate-4-compliance-approval`
- `gate-5-release-approval`
- `gate-6-deployment-approval`

Invoke payloads should include:
- `completedSkills` (array of completed dependency skill IDs)
- `approvalGates` (object where each required gate ID has status `approved`)

Optional environment override:

- `SKILLS_MD_PATH=/absolute/path/to/skills.md`
- `AGENT_API_TOKEN=<token>` (if set, requests to `/api/agent/skills` and `/api/agent/skills/:skillId/invoke` must include `x-agent-api-token`)
- `DEPLOYMENT_PROFILE_MODE=user-preferred`
- `DEFAULT_DEPLOYMENT_PROFILE=vercel-docker-n8n`
- `MCP_PROTOCOL_VERSION=2`

Default deployment profile behavior:
- Prefer `vercel-docker-n8n` for deployment-related skill invocations.
- Allow override by passing `deployment_profile` in invoke payload.
- Auto-inject selected profile details and MCP-2 version context into deployment skill inputs.

## 🔒 Licensing & Terms

This project is protected under a commercial license. Usage, redistribution, or modification requires purchasing a license from the owner.

**Contact:** marketing-support@bobbiedigital.com to inquire about purchasing a license.

Unauthorized use is strictly prohibited.

## 🙏 Acknowledgements

Developed by Bobbie Digital, powered by MCP and AI automation technologies.

**We make going digital easy.**
