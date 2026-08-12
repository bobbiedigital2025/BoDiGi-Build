---
name: apify-generate-output-schema
description: Generate output schemas (dataset_schema.json, output_schema.json, key_value_store_schema.json) for an Apify Actor by analyzing its source code. Use when creating or updating Actor output schemas.
---

# Generate Actor output schema

Analyze the Actor's source code and generate `dataset_schema.json`, `output_schema.json`, and (if needed) `key_value_store_schema.json`, then update `actor.json`.

## Core principles

- **Analyze code first** — Read the Actor's source to understand what data it actually pushes
- **Every field is nullable** — Always set `"nullable": true`
- **Anonymize examples** — Never use real user IDs, usernames, or personal data
- **Reuse existing patterns** — Match structure, naming, and style from other schemas in the repo
- **Verify against types** — Cross-check against TypeScript interfaces or Python TypedDicts

---

## Phase 1: Discover Actor structure

1. Find `.actor/actor.json`
2. Search for existing schemas in the repo to learn conventions
3. Find all `Actor.pushData(` / `Actor.push_data(` calls → dataset fields
4. Find all `Actor.setValue(` / `Actor.set_value(` calls → key-value store keys
5. Find TypeScript interfaces / Python TypedDicts / dataclasses for output type definitions

---

## Phase 2: Generate `dataset_schema.json`

```json
{
    "actorSpecification": 1,
    "fields": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": { /* ALL output fields */ },
        "required": [],
        "additionalProperties": true
    },
    "views": {
        "overview": {
            "title": "Overview",
            "transformation": { "fields": [ /* 8-12 key fields */ ] },
            "display": { "component": "table", "properties": { /* label + format */ } }
        }
    }
}
```

### Hard rules

| Rule | Detail |
|------|--------|
| `"nullable": true` | On **every** field |
| `"additionalProperties": true` | On top-level `fields` AND every nested object |
| `"required": []` | On top-level `fields` AND every nested object |
| `"type"` with `"nullable"` | AJV rejects `nullable` without `type` |
| All fields in `properties` | Must include ALL output fields, not just overview fields |

### Field patterns

**String:** `{ "type": "string", "nullable": true, "description": "...", "example": "..." }`
**Number:** `{ "type": "number", "nullable": true, "example": 15000 }`
**Boolean:** `{ "type": "boolean", "nullable": true, "example": true }`
**Array:** `{ "type": "array", "items": { "type": "string" }, "nullable": true }`
**Object:** `{ "type": "object", "properties": {...}, "required": [], "additionalProperties": true, "nullable": true }`

---

## Phase 3: Generate `key_value_store_schema.json` (if applicable)

Skip if no `setValue` / `set_value` calls found (beyond `INPUT`).

```json
{
    "actorKeyValueStoreSchemaVersion": 1,
    "title": "...",
    "collections": {
        "screenshots": {
            "title": "Screenshots",
            "keyPrefix": "screenshot-",
            "contentTypes": ["image/png"]
        }
    }
}
```

Each collection uses `key` (exact) OR `keyPrefix` (prefix) — not both.

---

## Phase 4: Generate `output_schema.json`

```json
{
    "actorOutputSchemaVersion": 1,
    "title": "...",
    "properties": {
        "dataset": {
            "type": "string",
            "title": "Results",
            "description": "Dataset containing all scraped data",
            "template": "{{links.apiDefaultDatasetUrl}}/items"
        }
    }
}
```

> Every property **must** have `"type": "string"`. Only `"string"` is valid — not `"object"`.

---

## Phase 5: Update `actor.json`

Add schema references:
```json
{
    "input": "./input_schema.json",
    "output": "./output_schema.json",
    "storages": {
        "dataset": "./dataset_schema.json",
        "keyValueStore": "./key_value_store_schema.json"
    }
}
```

---

## Phase 6: Review checklist

- [ ] ALL output fields are in `fields.properties` (not just overview fields)
- [ ] Every field has `"nullable": true` and `"type"`
- [ ] Top-level `fields` has `"additionalProperties": true` and `"required": []`
- [ ] Every nested object also has `"additionalProperties": true` and `"required": []`
- [ ] Every field has `"description"` and `"example"` (anonymized)
- [ ] Overview shows 8-12 most useful fields
- [ ] `output_schema.json` has `"type": "string"` on every property
- [ ] `actor.json` references all generated schema files
- [ ] Field names match actual keys in code (camelCase/snake_case consistent)
