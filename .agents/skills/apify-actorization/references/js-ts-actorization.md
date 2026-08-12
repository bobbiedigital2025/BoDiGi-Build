# JavaScript/TypeScript Actorization

## Install the Apify SDK

```bash
npm install apify
```

## Wrap main code with Actor lifecycle

```javascript
import { Actor } from 'apify';

await Actor.init();

const input = await Actor.getInput();
console.log('Input:', input);

// Your existing code here

await Actor.exit();
```

## Key points

- `Actor.init()` configures storage to use Apify API when running on platform
- `Actor.exit()` handles graceful shutdown and cleanup
- Both calls must be awaited
- Local execution remains unchanged — the SDK automatically detects the environment

## Crawlee projects

```javascript
import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();
const { startUrl = 'https://example.com', maxItems = 100 } = input ?? {};

let itemCount = 0;

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, pushData }) => {
        if (itemCount >= maxItems) return;
        const title = await page.title();
        await pushData({ url: request.url, title });
        itemCount++;
    },
});

await crawler.run([startUrl]);
await Actor.exit();
```

## Express/HTTP servers

For web servers, set `usesStandbyMode: true` in actor.json and implement a readiness probe.
See `apify-actor-development/references/standby-mode.md`.

## Batch processing scripts

```javascript
import { Actor } from 'apify';

await Actor.init();
const input = await Actor.getInput();
const items = input.items || [];

for (const item of items) {
    const result = processItem(item);
    await Actor.pushData(result);
}

await Actor.exit();
```
