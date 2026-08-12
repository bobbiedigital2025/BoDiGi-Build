# Actor Standby mode reference

## When to use
Use Standby for interactive, real-time HTTP requests — API endpoints, webhook receivers, MCP servers.

## Configuration

Set `usesStandbyMode: true` in `.actor/actor.json`:

```json
{
    "actorSpecification": 1,
    "name": "my-api-actor",
    "usesStandbyMode": true,
    "webServerSchema": "./openapi.json"
}
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `ACTOR_WEB_SERVER_PORT` | Port the HTTP server must listen on |
| `ACTOR_STANDBY_URL` | The public Standby URL (stable across runs) |
| `APIFY_META_ORIGIN` | Set to `STANDBY` when launched in Standby mode |

## Readiness probe

Respond with HTTP 200 to `GET /` requests with `x-apify-container-server-readiness-probe` header.

## Rules

- **NEVER disable standby mode** without explicit user permission
- **NEVER call `Actor.exit()`** after handling a request
- **ALWAYS listen on the SDK-provided port**, not hardcoded
- **ALWAYS implement the readiness probe** at `GET /`
