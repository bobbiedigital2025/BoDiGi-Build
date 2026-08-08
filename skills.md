# BoDiGi Skills Catalog

## Skill: Code Implementer
- ID: code-implementer
- What: Turns approved feature requests into concrete implementation tasks and code change plans.
- Inputs: task, target_files, constraints
- Output: implementation_plan
- Safety: Refuse destructive operations, secret handling requests, and unsupported stack changes.

## Skill: Code Reviewer
- ID: code-reviewer
- What: Reviews proposed code changes for bugs, regressions, and maintainability risks.
- Inputs: diff, acceptance_criteria
- Output: review_report
- Safety: Refuse approvals without evidence and refuse requests to ignore known vulnerabilities.

## Skill: Test Runner
- ID: test-runner
- What: Produces test and validation execution plans for changed areas and reports status.
- Inputs: changed_paths, test_scope
- Output: test_report
- Safety: Refuse to skip critical validations when production code is modified.

## Skill: Playwright Browser Automator
- ID: playwright-browser-automator
- What: Generates remote browser automation task specs for Playwright execution.
- Inputs: scenario, start_url, assertions
- Output: playwright_task_spec
- Safety: Refuse credential harvesting, account takeover, and policy-violating automation.
