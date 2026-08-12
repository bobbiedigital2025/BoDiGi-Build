# Dataset schema reference

Configure `.actor/dataset_schema.json` to define how output is displayed in Apify Console.

## Structure

```json
{
    "actorSpecification": 1,
    "fields": {},
    "views": {
        "overview": {
            "title": "Overview",
            "transformation": { "fields": ["field1", "field2"] },
            "display": {
                "component": "table",
                "properties": {
                    "field1": { "label": "Label", "format": "text" }
                }
            }
        }
    }
}
```

## Display formats
`text`, `number`, `date`, `link`, `boolean`, `image`, `array`, `object`
