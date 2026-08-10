# ADR-0001 — Single-context repo layout

**Date:** 2026-08-10  
**Status:** Accepted

## Context

BoDiGi-Build is a single monorepo with a frontend and backend. No separate packages or workspaces.

## Decision

Use a single `CONTEXT.md` at the repo root plus `docs/adr/` for Architecture Decision Records.
No multi-context `CONTEXT-MAP.md` is needed.

## Consequences

All agents read one `CONTEXT.md`. Adding a new app module may require revisiting this ADR.
