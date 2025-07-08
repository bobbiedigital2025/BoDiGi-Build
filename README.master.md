# BoDiGi-Build: AI-Powered SaaS Builder with Agent Intelligence + MCP

Welcome to **BoDiGi-Build**, your next-gen AI-powered app builder designed to empower creators, founders, and developers with an intuitive, automation-first experience. This platform combines AI agent intelligence, real-time collaboration, and secure system architecture built on MCP (Model Context Protocol).

---

## 🧠 Core Platform Capabilities

- ✅ Full-Stack App Builder (React + Vite + Tailwind + Node.js + Express)
- ✅ MCP + A2A authentication-first architecture
- ✅ Supabase for database and secure auth
- ✅ Stripe subscriptions with usage-based billing
- ✅ Built-in **AI Agent** interface with:
  - Text **and voice prompting** for instructions
  - Agent listens, interprets, and responds with a clear **summary** of what it understood
  - Follows an **approval-first flow**: asks for confirmation before applying changes
  - Asks **clarifying questions** or probing prompts if instructions are vague
- ✅ Drag-and-drop editor for easy customization
- ✅ Live preview window embedded inside the app
- ✅ File explorer pane (VS Code-style) showing real-time project structure
- ✅ Download project as `.zip` or individual files
- ✅ Encrypted secret manager tab:
  - Secrets hidden as `*****`, togglable for view
  - AI can access only when authorized by user

---

## 📁 Suggested Folder Structure

If you're starting clean (like this folder), here’s what will be built:

```
/frontend         → React/Vite/Tailwind frontend UI
/backend          → Node.js/Express server
.env.example      → Placeholder env variables
README.md         → You’re reading it!
LICENSE.txt       → Usage terms
BoDiGi-Prompts.md → AI prompt pack for consistent builds
```

---

## 💬 Text + Voice Prompting in Action

Users can:
- **Speak** or **type** instructions to the AI agent
- Receive a **real-time summary** of what the agent understood
- Confirm, revise, or clarify — nothing proceeds without approval
- Guide layout changes, page creation, and logic integrations via natural conversation

Example:
> "Add a pricing section with 3 tiers and link it to Stripe."

Agent responds:
> “You want a pricing section with 3 tiers integrated with Stripe. Should I create this in the frontend and link to your pricing ID in the backend? Or should I generate default tiers for now?”

---

## 🛡️ Security & Smart Control

- All secrets (API keys, tokens) stay encrypted
- AI agents access secrets **only with user authorization**
- Users can toggle `.env` visibility on-screen
- Usage credits and task limits tracked via the MCP Agent Control Layer

---

## 📜 License

This project is covered by the **BoDiGi™ Proprietary Use License v1.0**  
Unauthorized use, replication, or resale is prohibited.  
Contact: marketing-support@bobbiedigital.com for licensing.

---

## 🙌 About

Built by **Bobbie Digital**  
Founder: Bobbie Jo Gray  
AI Lead: Boltz™  
Slogan: *“We make going digital easy.”*