# Triage Labels

## Labels

| Label | Purpose |
|---|---|
| `needs-triage` | New issue, not yet reviewed by a human or agent |
| `needs-info` | Blocked — waiting for more information from the reporter |
| `ready-for-agent` | Triaged and ready for an AI agent to work on |
| `ready-for-human` | Requires human review, decision, or action |
| `wontfix` | Acknowledged but will not be addressed |

## Usage rules

- Every new issue lands in `needs-triage` automatically (via triage skill or manual label).
- An issue moves to `ready-for-agent` only after a human or orchestrator confirms scope and priority.
- An issue moves to `ready-for-human` when the agent is blocked or the change requires a human decision (e.g. legal, credentials, deployment approval).
- `wontfix` is set by a human only — agents must not set this label autonomously.
- Only one primary triage label should be active on an issue at a time.

## Creating labels (one-time setup)

Run once to create all labels in GitHub:

```bash
gh label create needs-triage --color 0075ca --description "New issue, not yet reviewed"
gh label create needs-info --color e4e669 --description "Waiting for more information"
gh label create ready-for-agent --color 7057ff --description "Ready for AI agent to work on"
gh label create ready-for-human --color d93f0b --description "Requires human review or action"
gh label create wontfix --color ffffff --description "Will not be addressed"
```
