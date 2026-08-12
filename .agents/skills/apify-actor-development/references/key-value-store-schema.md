# Key-value store schema reference

## Structure

```json
{
    "actorKeyValueStoreSchemaVersion": 1,
    "title": "Key-Value Store Schema",
    "collections": {
        "documents": {
            "title": "Documents",
            "keyPrefix": "document-"
        }
    }
}
```

## Collection properties

- `title` (required) - Collection title in UI
- `key` OR `keyPrefix` (required, one of) - Key matching strategy
- `contentTypes` (optional) - Allowed content types
- `jsonSchema` (optional) - JSON Schema for validation
