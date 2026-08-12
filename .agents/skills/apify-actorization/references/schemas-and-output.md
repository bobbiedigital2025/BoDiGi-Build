# Schemas and output configuration

## Input schema

Map your application's inputs to `.actor/input_schema.json`.

```json
{
    "title": "My Actor Input",
    "type": "object",
    "schemaVersion": 1,
    "properties": {
        "startUrl": {
            "title": "Start URL",
            "type": "string",
            "description": "The URL to start processing from",
            "editor": "textfield",
            "prefill": "https://example.com"
        },
        "maxItems": {
            "title": "Max Items",
            "type": "integer",
            "description": "Maximum number of items to process",
            "default": 100,
            "minimum": 1
        }
    },
    "required": ["startUrl"]
}
```

### Mapping guidelines

- Command-line arguments → input schema properties
- Environment variables → input schema or Actor env vars in actor.json
- Config files → input schema with object/array types

## Output

### Table-like data (multiple items)

Use `Actor.pushData()` / `Actor.push_data()` — each item becomes a dataset row.

### Single files or blobs

Use key-value store: `Actor.setValue()` / `Actor.set_value()`

### State management

**Request queue** — pausable task processing:
```javascript
const requestQueue = await Actor.openRequestQueue();
await requestQueue.addRequest({ url: 'https://placeholder.local', uniqueKey: `task-${taskId}`, userData: { itemId: 123 } });
```

**Key-value store** — checkpoint state:
```javascript
await Actor.setValue('STATE', { processedCount: 100 });
const state = await Actor.getValue('STATE') || { processedCount: 0 };
```
