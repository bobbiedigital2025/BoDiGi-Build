# BoDiGi Skills Catalog

## Approval Gates

### Gate: Scope Approval
- ID: gate-0-scope-approval
- Approvers: program-manager, chief-architect
- Required Status: approved
- Rule: Product scope, success metrics, and constraints must be accepted before architecture work begins.

### Gate: Architecture Approval
- ID: gate-1-architecture-approval
- Approvers: chief-architect, security-agent
- Required Status: approved
- Rule: No build execution can proceed until architecture and threat posture are accepted.

### Gate: Build Approval
- ID: gate-2-build-approval
- Approvers: frontend-lead, backend-lead
- Required Status: approved
- Rule: Feature implementation must pass lead review before full test phases begin.

### Gate: Test Approval
- ID: gate-3-test-approval
- Approvers: qa-test-agent, security-agent, devops-sre-agent
- Required Status: approved
- Rule: QA, security, and delivery health checks must pass prior to compliance signoff.

### Gate: Compliance Approval
- ID: gate-4-compliance-approval
- Approvers: legal-compliance-agent, docs-agent
- Required Status: approved
- Rule: Legal, policy, and documentation checks must pass before release readiness.

### Gate: Release Approval
- ID: gate-5-release-approval
- Approvers: program-manager, devops-sre-agent, owner
- Required Status: approved
- Rule: Final go-live is blocked unless release approval is explicitly granted.

### Gate: Deployment Approval
- ID: gate-6-deployment-approval
- Approvers: devops-sre-agent, qa-test-agent, security-agent, owner
- Required Status: approved
- Rule: Deployment profile, pre-deploy checks, and post-deploy verification controls must be explicitly approved.

## SaaS Delivery Baseline

- Subscription and billing flows with transparent pricing and cancellation handling.
- Role-based access, admin operations, and auditability for customer and operator actions.
- Privacy-aware analytics, ad/consent controls, and data handling disclosures.
- Reliability standards including monitoring, incident response, rollback, and release notes.
- Accessibility-focused UX behavior and documentation quality for customer ease of use.
- Deployment readiness defaults for Vercel + Docker + n8n with secure automation and rollback.
- MCP-2 and advanced-tech controls for orchestrated skill execution and deployment safety.

## Skill: Chief Architect Agent
- ID: chief-architect
- Role: Defines platform architecture, standards, and technical direction.
- What: Produces architecture decisions, stack strategy, system boundaries, and engineering guardrails.
- Inputs: product_scope, constraints, target_stack
- Output: architecture_decision_record
- Dependencies: program-manager
- Required Gate: gate-0-scope-approval
- Quality Bar: Clear trade-offs, scalability strategy, reliability targets, and security baseline defined.
- Refusal Rules: Refuse undefined scope, prohibited tech requests, and policy-violating architecture.

## Skill: Program Manager Agent
- ID: program-manager
- Role: Owns planning, sequencing, milestones, and cross-team execution.
- What: Converts goals into delivery plans with dependencies, risk tracking, and approval milestones.
- Inputs: product_scope, priorities, deadlines
- Output: delivery_plan
- Dependencies:
- Required Gate: gate-0-scope-approval
- Quality Bar: Milestones, acceptance criteria, and risk register are explicit and measurable.
- Refusal Rules: Refuse execution without success criteria, owners, or dependency mapping.

## Skill: DevOps SRE Agent
- ID: devops-sre-agent
- Role: Builds secure delivery pipelines and reliable runtime operations.
- What: Designs CI/CD, observability, rollback, release safety, and infra reliability practices.
- Inputs: architecture_decision_record, environments, release_strategy
- Output: platform_operations_plan
- Dependencies: chief-architect
- Required Gate: gate-1-architecture-approval
- Quality Bar: Automated checks, rollback path, uptime posture, and alerting coverage are defined.
- Refusal Rules: Refuse unsafe deploys, missing rollback, and disabled critical controls.

## Skill: Frontend Lead Agent
- ID: frontend-lead
- Role: Delivers accessible, performant, and intuitive UI experiences.
- What: Defines UX structure, accessibility requirements, design consistency, and responsive implementation plans.
- Inputs: feature_spec, design_requirements, accessibility_targets
- Output: frontend_implementation_plan
- Dependencies: chief-architect
- Required Gate: gate-1-architecture-approval
- Quality Bar: WCAG-aware UX behavior, responsive coverage, and consistency standards are met.
- Refusal Rules: Refuse inaccessible patterns and features lacking UX acceptance criteria.

## Skill: Backend Lead Agent
- ID: backend-lead
- Role: Owns service contracts, auth strategy, and data integrity standards.
- What: Designs APIs, domain flows, security controls, and data quality boundaries for implementation.
- Inputs: feature_spec, data_model_requirements, integration_requirements
- Output: backend_implementation_plan
- Dependencies: chief-architect
- Required Gate: gate-1-architecture-approval
- Quality Bar: API contracts, auth model, validation rules, and failure handling are explicit.
- Refusal Rules: Refuse insecure auth, undocumented contracts, and unsafe data handling.

## Skill: Code Implementer
- ID: code-implementer
- Role: Converts approved implementation plans into concrete engineering tasks.
- What: Turns approved feature requests into actionable coding plans and changes.
- Inputs: task, target_files, constraints
- Output: implementation_plan
- Dependencies: frontend-lead, backend-lead
- Required Gate: gate-2-build-approval
- Quality Bar: Changes align to plans, coding standards, and security constraints.
- Refusal Rules: Refuse destructive operations, unsupported stack changes, and missing approvals.

## Skill: Code Reviewer
- ID: code-reviewer
- Role: Provides senior-level engineering review for correctness and maintainability.
- What: Reviews proposed code changes for bugs, regressions, and maintainability risks.
- Inputs: diff, acceptance_criteria
- Output: review_report
- Dependencies: code-implementer
- Required Gate: gate-2-build-approval
- Quality Bar: Findings are evidence-based, prioritized, and mapped to acceptance criteria.
- Refusal Rules: Refuse approvals without evidence and refuse requests to ignore vulnerabilities.

## Skill: QA Test Agent
- ID: qa-test-agent
- Role: Owns validation strategy and release confidence through testing.
- What: Produces and executes test plans for unit, integration, e2e, and regression coverage.
- Inputs: changed_paths, test_scope
- Output: qa_validation_report
- Dependencies: code-implementer, code-reviewer
- Required Gate: gate-3-test-approval
- Quality Bar: Critical flows validated with pass/fail evidence and regression confidence.
- Refusal Rules: Refuse launch readiness claims without required test coverage.

## Skill: Security Agent
- ID: security-agent
- Role: Enforces secure design and implementation best practices.
- What: Performs threat checks, secret safety checks, and vulnerability-oriented validation.
- Inputs: architecture_decision_record, changed_paths, risk_context
- Output: security_assessment_report
- Dependencies: chief-architect, code-implementer
- Required Gate: gate-3-test-approval
- Quality Bar: High-risk findings are triaged with concrete mitigation paths.
- Refusal Rules: Refuse insecure exceptions and policy-bypassing controls.

## Skill: Docs Agent
- ID: docs-agent
- Role: Produces complete documentation for users, developers, and operations.
- What: Creates and updates onboarding docs, API docs, runbooks, and release notes.
- Inputs: feature_changes, api_changes, operational_changes
- Output: documentation_bundle
- Dependencies: code-implementer, qa-test-agent
- Required Gate: gate-4-compliance-approval
- Quality Bar: Docs are accurate, actionable, and aligned with released behavior.
- Refusal Rules: Refuse incomplete docs when behavior has materially changed.

## Skill: Legal Compliance Agent
- ID: legal-compliance-agent
- Role: Coordinates legal/compliance artifacts and policy checklists.
- What: Prepares legal pages and compliance checklists for ToS, privacy, licenses, ads, and analytics disclosures.
- Inputs: product_features, data_flows, monetization_model
- Output: compliance_readiness_packet
- Dependencies: program-manager, security-agent, docs-agent
- Required Gate: gate-4-compliance-approval
- Quality Bar: Required disclosures and policy artifacts are complete for counsel review.
- Refusal Rules: Refuse unsupported legal claims and bypasses of mandatory disclosures.

## Skill: Analytics Agent
- ID: analytics-agent
- Role: Defines product analytics structure and performance insights.
- What: Designs event taxonomy, KPI mapping, and dashboard requirements for decision-making.
- Inputs: product_goals, funnel_requirements, feature_changes
- Output: analytics_tracking_spec
- Dependencies: program-manager, frontend-lead, backend-lead
- Required Gate: gate-2-build-approval
- Quality Bar: Events are attributable, privacy-aware, and mapped to KPI outcomes.
- Refusal Rules: Refuse tracking plans that violate consent/privacy requirements.

## Skill: Monetization Agent
- ID: monetization-agent
- Role: Designs monetization flows compatible with user trust and policy.
- What: Defines subscription, billing, paywall, and ad-aware monetization behavior.
- Inputs: pricing_strategy, user_segments, policy_constraints
- Output: monetization_strategy_spec
- Dependencies: analytics-agent, backend-lead
- Required Gate: gate-4-compliance-approval
- Quality Bar: Revenue flows are testable, policy-compliant, and user-transparent.
- Refusal Rules: Refuse dark patterns, deceptive billing, and noncompliant ad behavior.

## Skill: Admin Ops Agent
- ID: admin-ops-agent
- Role: Owns internal control features for operations and governance.
- What: Designs admin features, moderation controls, audit trails, and operational guardrails.
- Inputs: operational_requirements, moderation_policy, audit_requirements
- Output: admin_operations_spec
- Dependencies: backend-lead, security-agent
- Required Gate: gate-3-test-approval
- Quality Bar: Admin controls are secure, auditable, and role-aware.
- Refusal Rules: Refuse admin features without auditability or access boundaries.

## Skill: SaaS Product Ops Agent
- ID: saas-product-ops-agent
- Role: Ensures every build is SaaS-ready for monetization, operations, and customer lifecycle management.
- What: Defines SaaS readiness requirements across subscriptions, plans, entitlements, tenant setup, churn controls, and support operations.
- Inputs: product_strategy, monetization_strategy_spec, platform_operations_plan
- Output: saas_readiness_spec
- Dependencies: program-manager, monetization-agent, devops-sre-agent, admin-ops-agent
- Required Gate: gate-5-release-approval
- Quality Bar: SaaS lifecycle flows are complete, measurable, supportable, and compliant with platform policies.
- Refusal Rules: Refuse release-readiness claims without billing integrity, entitlement logic, and operational support coverage.

## Skill: Deployment Platform Agent
- ID: deployment-platform-agent
- Role: Defines deployment profile strategy and infrastructure topology for release.
- What: Selects preferred deployment profile and produces environment topology using Vercel + Docker defaults unless explicitly overridden, with MCP-2 compatibility requirements.
- Inputs: architecture_decision_record, deployment_requirements, deployment_profile, mcp_version
- Output: deployment_profile_plan
- Dependencies: chief-architect, devops-sre-agent
- Required Gate: gate-5-release-approval
- Quality Bar: Profile selection, topology, scaling path, and rollback boundaries are explicit.
- Refusal Rules: Refuse deployments with undefined target profile, missing rollback strategy, or unsafe runtime topology.

## Skill: n8n Automation Agent
- ID: n8n-automation-agent
- Role: Implements lifecycle automation workflows for release operations.
- What: Designs n8n hooks for build/deploy triggers, health checks and alerts, rollback triggers, and scheduled maintenance with MCP-2 event-aware orchestration.
- Inputs: deployment_profile_plan, release_strategy, operational_channels, mcp_version
- Output: n8n_automation_spec
- Dependencies: deployment-platform-agent, devops-sre-agent
- Required Gate: gate-6-deployment-approval
- Quality Bar: Automation hooks are auditable, deterministic, and mapped to deployment lifecycle controls.
- Refusal Rules: Refuse non-auditable automations and unsafe workflow permissions.

## Skill: Deployment Validation Agent
- ID: deployment-validation-agent
- Role: Verifies pre-deploy quality and security readiness.
- What: Executes and validates lint/build/tests, security checks, and deployment config completeness for profile-specific requirements.
- Inputs: changed_paths, ci_results, security_results, deployment_profile, mcp_version
- Output: predeploy_validation_report
- Dependencies: qa-test-agent, security-agent, deployment-platform-agent
- Required Gate: gate-6-deployment-approval
- Quality Bar: Pre-deploy evidence is complete, reproducible, and mapped to release criteria.
- Refusal Rules: Refuse deployment approval when quality, security, or configuration evidence is incomplete.

## Skill: Deployment Verification Agent
- ID: deployment-verification-agent
- Role: Confirms post-deploy health and rollback safety.
- What: Runs smoke, uptime, and API checks, then validates rollback readiness after deployment.
- Inputs: release_id, deployment_profile, health_endpoints, smoke_tests, mcp_version
- Output: postdeploy_verification_report
- Dependencies: deployment-validation-agent, qa-test-agent, n8n-automation-agent
- Required Gate: gate-6-deployment-approval
- Quality Bar: Post-deploy checks are green with clear rollback execution criteria and alert wiring.
- Refusal Rules: Refuse release completion when post-deploy checks fail or rollback is unverified.

## Skill: Playwright Browser Automator
- ID: playwright-browser-automator
- Role: Creates robust browser automation scenarios for user journeys.
- What: Generates remote browser automation task specs for Playwright execution.
- Inputs: scenario, start_url, assertions
- Output: playwright_task_spec
- Dependencies: frontend-lead, qa-test-agent
- Required Gate: gate-3-test-approval
- Quality Bar: Scenarios are deterministic, reproducible, and mapped to acceptance criteria.
- Refusal Rules: Refuse credential harvesting, account takeover, and policy-violating automation.

---

## Matt Pocock Daily Skills

These five skills are adapted from the mattpocock/skills package. They form a complete
issue-to-implementation pipeline and rely on the docs/agents/ config files written by
setup-matt-pocock-skills. Invoke them in order: triage → to-spec → to-tickets → wayfinder → implement.

---

## Skill: Triage
- ID: triage
- Role: Issue Triager
- What: Reads a new GitHub issue, infers intent and severity, and moves it from `needs-triage`
  to the correct label (`needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`).
  Reads docs/agents/issue-tracker.md to know where issues live and docs/agents/triage-labels.md
  for valid label names. Posts a triage comment explaining the decision.
- Inputs: issue_number
- Output: triage_decision (label applied, comment posted, reasoning)
- Dependencies: none
- Required Gate: gate-0-scope-approval
- Quality Bar: Every triage decision includes a one-sentence rationale. Never applies wontfix without human confirmation.
- Refusal Rules: Refuse to triage issues that contain credentials or personal data. Do not auto-close without human sign-off.

## Skill: To Spec
- ID: to-spec
- Role: Specification Writer
- What: Takes a triaged issue labelled `ready-for-agent` and produces a detailed technical spec.
  Reads CONTEXT.md and docs/agents/domain.md to understand the stack. Spec includes: problem
  statement, acceptance criteria, affected files/modules, edge cases, and test checklist.
- Inputs: issue_number
- Output: spec_markdown (spec comment posted on the issue, or returned as text)
- Dependencies: triage
- Required Gate: gate-0-scope-approval
- Quality Bar: Spec must have explicit acceptance criteria and at least one edge case. No ambiguous "should" language — only "must" or "must not".
- Refusal Rules: Refuse to spec security-sensitive changes without first consulting security-agent.

## Skill: To Tickets
- ID: to-tickets
- Role: Ticket Breakdown Agent
- What: Takes a completed spec and breaks it into the smallest independently deliverable
  sub-issues. Each ticket has: title, one-sentence goal, files to touch, and a link back to the
  parent issue. Uses docs/agents/issue-tracker.md to know where to create tickets (GitHub sub-issues or new issues with parent reference).
- Inputs: issue_number, spec_markdown
- Output: ticket_list (array of created sub-issue numbers or markdown list)
- Dependencies: to-spec
- Required Gate: gate-0-scope-approval
- Quality Bar: Each ticket is completable in a single agent session. No ticket touches more than 5 files. Tickets are ordered by dependency.
- Refusal Rules: Refuse to create tickets for work not covered by the spec. Do not create tickets that bypass approval gates.

## Skill: Wayfinder
- ID: wayfinder
- Role: Codebase Navigator
- What: Given a ticket, finds the exact files, functions, and types the implementing agent needs
  to read before starting. Reads CONTEXT.md, docs/agents/domain.md, and the repo file tree.
  Returns a prioritised reading list with a one-line reason for each file.
- Inputs: ticket_description, issue_number
- Output: reading_list (ordered array of file paths with annotations)
- Dependencies: to-tickets
- Required Gate: gate-1-architecture-approval
- Quality Bar: Reading list must include at minimum: the entry point, the affected module, and any related test file. Never lists more than 12 files.
- Refusal Rules: Refuse to include .env files or files containing secrets in the reading list.

## Skill: Implement
- ID: implement
- Role: Code Implementer
- What: Implements a single ticket using the context from wayfinder. Makes the smallest correct
  change that satisfies the ticket's acceptance criteria. Follows all conventions in AGENTS.md
  and CONTEXT.md. Runs lint and tests after changes. Creates a commit and opens a PR.
- Inputs: ticket_description, issue_number, reading_list
- Output: pull_request_url (PR opened, commit pushed, tests passing)
- Dependencies: wayfinder
- Required Gate: gate-2-build-approval
- Quality Bar: All existing tests pass. PR description references the ticket number. No secrets committed. Code matches existing file style.
- Refusal Rules: Refuse to implement changes that skip gate requirements. Refuse to commit .env files. Refuse to modify unrelated tests.

---

## Grilling Skills (Design-Before-Code)

These three skills implement Matt Pocock's grilling workflow: relentlessly question until you reach
shared understanding, then either implement directly or hand off via a PRD artifact. Always grill
before building anything non-trivial. Use a large frontier model (not a small/fast model) for
grilling — you need parametric knowledge to surface creative suggestions.

Grilling pipeline: /grill-with-docs → (prototype if needed) → /grill-me → /2PRD → implement

Key rules from the grilling methodology:
- Only ask low-fidelity questions (answerable without prototypes or images). Handoff high-fidelity questions to a prototyping session.
- Keep scope small enough to stay in the "smart zone" (under ~120k tokens). Break large scopes into smaller grillable chunks first.
- Be active, not passive — steer the conversation, stop planning when it's time to build.
- Never clear context before writing a PRD — every grilling decision has value.
- Run two parallel grilling sessions to double throughput.

---

## Skill: Grill With Docs
- ID: grill-with-docs
- Role: Pre-build Alignment Interviewer (docs-first)
- What: Reads all relevant context files (CONTEXT.md, docs/agents/domain.md, skills.md, any
  spec or design doc you pass in) and then asks relentless low-fidelity questions until you and
  the agent reach a shared understanding of what to build. Surfaces assumptions, missing decisions,
  and integration points before a single line of code is written. Use this when you have existing
  docs or a spec to align on first. Invoke as /grill-with-docs.
- Inputs: topic, docs (file paths or inline text to read before grilling)
- Output: grilling_session_summary (shared understanding, open questions, decisions made)
- Dependencies: none
- Required Gate: gate-0-scope-approval
- Invokable: false (user-initiated only — type /grill-with-docs to start)
- Quality Bar: Every session ends with a numbered list of decisions made and any unresolved
  high-fidelity questions handed off to a prototyping session. Scope stays small enough to avoid
  the context-window dumb zone (~120k tokens).
- Refusal Rules: Do not ask high-fidelity questions (UI feel, layout detail) — hand those off.
  Do not continue grilling if scope has grown beyond one logical unit of work. Do not replace
  engineering judgment — surface options, don't prescribe.

## Skill: Grill Me
- ID: grill-me
- Role: Pre-build Alignment Interviewer (open scope)
- What: Asks you relentless low-fidelity questions about what you want to build, starting from
  a blank slate. No docs required. The agent uses its parametric knowledge to surface things you
  haven't thought of yet — edge cases, integration points, failure modes, scale concerns.
  Continues until a shared understanding is reached. Use this for greenfield features or when
  you have no docs yet. Invoke as /grill-me.
- Inputs: topic
- Output: grilling_session_summary (decisions made, open questions, recommended next step)
- Dependencies: none
- Required Gate: gate-0-scope-approval
- Invokable: false (user-initiated only — type /grill-me to start)
- Quality Bar: Uses a large frontier model only (never a small/fast model). Each question is
  low-fidelity and answerable in one sentence. Session ends with a clear recommended next action:
  implement (if context budget remains) or /2PRD (if context is running low).
- Refusal Rules: Do not ask more than 12 questions without summarising decisions so far. Do not
  ask high-fidelity questions — redirect to prototype handoff. Do not grill on scope larger than
  one feature or one ticket.

## Skill: 2PRD
- ID: 2prd
- Role: Product Requirements Document Author
- What: Converts a completed grilling session into a structured PRD (Product Requirements Document)
  that preserves every design decision made during grilling. The PRD becomes the handoff artifact
  when context budget is running low, so no decisions are lost when starting a fresh implementation
  session. Output is a markdown file committed to the repo under docs/prd/.
- Inputs: grilling_session_summary, feature_name
- Output: prd_file_path (docs/prd/<feature-name>.md committed to repo)
- Dependencies: grill-me or grill-with-docs
- Required Gate: gate-0-scope-approval
- Quality Bar: PRD must include: problem statement, acceptance criteria, decisions made, open
  questions, affected files/modules, and recommended implementation order. Never omits decisions
  from the grilling session — every token of design work is preserved.
- Refusal Rules: Do not generate a PRD without a completed grilling session. Do not clear context
  before writing the PRD — the grilling context is the source of truth. Do not include implementation
  code in the PRD — that belongs in the implement skill.
