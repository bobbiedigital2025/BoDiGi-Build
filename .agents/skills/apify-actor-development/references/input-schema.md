# Input schema reference

## Structure

```json
{
    "title": "<INPUT-SCHEMA-TITLE>",
    "type": "object",
    "schemaVersion": 1,
    "properties": {},
    "required": []
}
```

## Common field types

- `string` with `editor: "textfield"` or `"textarea"`
- `boolean` - checkbox
- `integer` / `number`
- `array` with `editor: "requestListSources"` for URLs
- `object` with `editor: "proxy"` for proxy config
- `string` with `enum` + `enumTitles` for dropdowns
