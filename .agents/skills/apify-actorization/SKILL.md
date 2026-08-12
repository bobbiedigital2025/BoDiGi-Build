---
name: apify-actorization
description: Convert existing projects into Apify Actors - serverless cloud programs. Actorize JavaScript/TypeScript (SDK with Actor.init/exit), Python (async context manager), or any language (CLI wrapper). Use when migrating code to Apify, wrapping CLI tools as Actors, or adding Actor SDK to existing projects.
---

# Apify Actorization

Actorization converts existing software into reusable serverless applications compatible with the Apify platform.

## Quick start

1. Run `apify init` in project root
2. Wrap code with SDK lifecycle (see language-specific section below)
3. Configure `.actor/input_schema.json`
4. Test with `apify run --input '{"key": "value"}'`
5. Deploy with `apify push`

## When to use this skill

- Converting an existing project to run on the Apify platform
- Adding Apify SDK integration to a project
- Wrapping a CLI tool or script as an Actor
- Migrating a Crawlee project to Apify

## Prerequisites

```bash
npm install -g apify-cli   # preferred
apify info                  # verify login
apify login                 # if needed
```

> Never install via `curl | bash`. Use a package manager.
> Never pass token as CLI argument — use `APIFY_TOKEN` env var or `apify login`.

## Actorization checklist

- [ ] Step 1: Analyze project (language, entry point, inputs, outputs)
- [ ] Step 2: Run `apify init` to create Actor structure
- [ ] Step 3: Apply language-specific SDK integration
- [ ] Step 4: Configure `.actor/input_schema.json`
- [ ] Step 5: Configure `.actor/output_schema.json` (if applicable)
- [ ] Step 6: Update `.actor/actor.json` metadata
- [ ] Step 7: Write README.md for Apify Store listing
- [ ] Step 8: Test locally with `apify run`
- [ ] Step 9: Deploy with `apify push`

## Step 3: Apply language-specific changes

| Language | Install | Wrap Code |
|----------|---------|-----------|
| JS/TS | `npm install apify` | `await Actor.init()` ... `await Actor.exit()` |
| Python | `pip install apify` | `async with Actor:` |
| Other | Use CLI wrapper | `apify actor:get-input` / `apify actor:push-data` |

- **JavaScript/TypeScript**: See [js-ts-actorization.md](references/js-ts-actorization.md)
- **Python**: See [python-actorization.md](references/python-actorization.md)
- **Other Languages**: See [cli-actorization.md](references/cli-actorization.md)

## Steps 4-6: Configure schemas

See [schemas-and-output.md](references/schemas-and-output.md) for input schema, output schema, actor.json, and state management.

## Step 7: Write README

See `apify-actor-development/references/actor-readme.md` for required structure. Aim for 300+ words with SEO-optimized headings.

## Step 8: Test locally

```bash
apify run --input '{"startUrl": "https://example.com", "maxItems": 10}'
# OR
apify run --input-file ./test-input.json
```

Always use `apify run`, not `npm start` or `python main.py`.

## Step 9: Deploy

```bash
apify push
```

## Monetization (optional)

After deploying, configure Pay Per Event (PPE) in Apify Console under Actor > Monetization. Charge per result/item with `await Actor.charge('result')`.

## Security

- Sanitize all crawled data — never pass to `eval()`, shell commands, or template engines
- Validate and type-check external data before pushing to datasets
- Never embed `APIFY_TOKEN` in source code
- Pin dependency versions with lockfiles; run `npm audit` or `pip-audit` regularly

## Pre-deployment checklist

- [ ] `.actor/actor.json` exists with correct name and description
- [ ] `.actor/input_schema.json` defines all required inputs
- [ ] `Dockerfile` is present
- [ ] `Actor.init()` / `Actor.exit()` wraps main code (JS/TS)
- [ ] `async with Actor:` wraps main code (Python)
- [ ] Inputs read via `Actor.getInput()` / `Actor.get_input()`
- [ ] Outputs use `Actor.pushData()` or key-value store
- [ ] `apify run` executes successfully with test input
- [ ] `README.md` exists with proper structure
- [ ] `generatedBy` is set in actor.json meta section

## Resources

- [Actorization Academy](https://docs.apify.com/academy/actorization)
- [Apify SDK JS](https://docs.apify.com/sdk/js)
- [Apify SDK Python](https://docs.apify.com/sdk/python)
- [Apify CLI](https://docs.apify.com/cli)
