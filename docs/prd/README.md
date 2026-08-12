# PRD Archive

Product Requirements Documents live here. Each file is the output of a `/2PRD` skill run and
captures every design decision made during a grilling session (`/grill-me` or `/grill-with-docs`).

## Naming convention

```
docs/prd/<feature-name>.md
```

## When to create a PRD

- When context budget is running low at the end of a grilling session
- When handing off from a grilling session to a new implementation session
- Never before grilling — the PRD is the *output* of grilling, not the input

## How to use a PRD

Pass the PRD file path as context when starting a new `/implement` or `/grill-with-docs` session:

```
/grill-with-docs topic="checkout flow" docs="docs/prd/checkout-flow.md"
```
