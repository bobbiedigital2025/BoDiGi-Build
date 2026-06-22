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

## 🔒 Licensing & Terms

This project is protected under a commercial license. Usage, redistribution, or modification requires purchasing a license from the owner.

**Contact:** marketing-support@bobbiedigital.com to inquire about purchasing a license.

Unauthorized use is strictly prohibited.

## 🙏 Acknowledgements

Developed by Bobbie Digital, powered by MCP and AI automation technologies.

**We make going digital easy.**
