---
name: apify-sdk-integration
description: Integrate Apify into an existing JavaScript/TypeScript or Python application using the apify-client package. Use when adding web scraping, automation, or data extraction capabilities to an existing app via the Apify API.
---

# Apify SDK Integration

Add Apify Actor execution to an existing application using `apify-client`.

> **`apify-client`** = API client for **calling** Actors from your app.
> **`apify`** = SDK for **building** Actors. Wrong package for integration work.

## Prerequisites

User needs an `APIFY_TOKEN` from https://console.apify.com/settings/integrations.
Store as env var — never hardcode.

## Finding the Right Actor

Use MCP tools (`search-actors`, `fetch-actor-details`) or browse https://apify.com/store.
Append `.md` to any Actor's Store URL for markdown docs.

## JavaScript / TypeScript

```bash
npm install apify-client
```

### Synchronous (wait for results)
```typescript
import { ApifyClient } from 'apify-client';
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('apify/web-scraper').call({
    startUrls: [{ url: 'https://example.com' }],
    maxPagesPerCrawl: 10,
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
```

### Asynchronous (start and poll)
```typescript
const run = await client.actor('apify/web-scraper').start({ startUrls: [...] });
const finishedRun = await client.run(run.id).waitForFinish();
const { items } = await client.dataset(finishedRun.defaultDatasetId).listItems();
```

### Error handling
```typescript
try {
    const run = await client.actor('apify/web-scraper').call(input);
    if (run.status !== 'SUCCEEDED') throw new Error(`Actor failed: ${run.status}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
} catch (error) {
    if (error.statusCode === 401) { /* Invalid APIFY_TOKEN */ }
    throw error;
}
```

## Python

```bash
pip install apify-client
```

### Synchronous
```python
from apify_client import ApifyClient
import os

client = ApifyClient(token=os.environ['APIFY_TOKEN'])
run = client.actor('apify/web-scraper').call(run_input={
    'startUrls': [{'url': 'https://example.com'}],
    'maxPagesPerCrawl': 10,
})
items = client.dataset(run['defaultDatasetId']).list_items().items
```

### Async client (asyncio)
```python
from apify_client import ApifyClientAsync

client = ApifyClientAsync(token=os.environ['APIFY_TOKEN'])
run = await client.actor('apify/web-scraper').call(run_input={...})
items = (await client.dataset(run['defaultDatasetId']).list_items()).items
```

## REST API (any language)

```
POST https://api.apify.com/v2/actors/{actorId}/runs
Authorization: ******

GET https://api.apify.com/v2/actor-runs/{runId}
GET https://api.apify.com/v2/datasets/{datasetId}/items?format=json
```

## Best Practices

- Set `timeoutSecs` in Actor input to avoid indefinite waits
- Paginate large datasets with `limit` + `offset` (default limit 250K items)
- Reuse one `ApifyClient` instance across calls
- Always check Actor input schema before constructing input

## Documentation

- JS client: https://docs.apify.com/api/client/js
- Python client: https://docs.apify.com/api/client/python
- REST API: https://docs.apify.com/api/v2
- Apify docs (LLM): https://docs.apify.com/llms.txt
