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
