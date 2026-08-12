# Gotchas and cost guardrails

## Pricing models

| Model | How it works | Action before running |
|-------|-------------|----------------------|
| FREE | No per-result cost, only platform compute | None needed |
| PAY_PER_EVENT (PPE) | Charged per result item | MUST estimate cost first |
| FLAT_PRICE_PER_MONTH | Monthly subscription | Verify user has active subscription |

To check an Actor's pricing:

    apify actors info "ACTOR_ID" --user-agent apify-agent-skills/apify-ultimate-scraper --json

Read `.currentPricingInfo.pricingModel` and `.currentPricingInfo.pricePerEvent`.

## Cost estimation protocol

Before running any PPE Actor:

1. Get the per-event price from Actor info (`.currentPricingInfo.pricePerEvent`)
2. Multiply by the requested result count
3. Present the estimate to the user with this disclaimer:

> **Estimated cost: ~$X for Y results.** This is a rough estimate only - actual costs can vary significantly depending on the Actor, data complexity, retries, and platform changes. Always check your Apify billing dashboard for actual charges.

4. If estimate > $5: warn explicitly
5. If estimate > $20: require explicit user confirmation before proceeding

**Important:** Cost estimates in the workflow guides are approximate and may be inaccurate. Always present them as rough guidance with the disclaimer above, never as exact amounts.

## Common pitfalls

**Cookie-dependent Actors**
Some social media scrapers require cookies or login sessions. If an Actor returns auth errors or empty results unexpectedly, check its README:

    apify actors info "ACTOR_ID" --user-agent apify-agent-skills/apify-ultimate-scraper --readme

**Input mechanics**
Actor input is one JSON object, not an array. For JSON files or complex inputs, use `--input-file input.json`.

**Rate limiting on large scrapes**
Use `"proxyConfiguration": {"useApifyProxy": true}` and set reasonable concurrency limits.

**Empty results**
Common causes: too-narrow query, platform blocking without proxy, Actor requires cookies, wrong input field name.

**maxResults vs maxCrawledPages**
Different Actors use different limit field names. Always fetch the input schema to find the correct field.

**Deprecated Actors**
Check `.isDeprecated` in actor info. If `true`, search for alternatives.

## Error recovery

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `status: FAILED` | Actor crashed or input invalid | Read `.statusMessage`; check run log |
| `isDeprecated: true` | Actor is end-of-life | Search for replacement |
| Empty dataset | Query too narrow, geo-restriction, or anti-bot | Broaden search; enable Apify Proxy |
| Run takes >10 minutes | Large scrape | Switch to fire-and-forget with polling |
