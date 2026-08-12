# Actor configuration (actor.json)

The `.actor/actor.json` file contains the Actor's configuration including metadata, schema references, and platform settings.

## Structure

```json
{
    "actorSpecification": 1,
    "name": "project-name",
    "title": "Project Title",
    "description": "Actor description",
    "version": "0.0",
    "meta": {
        "templateId": "template-id",
        "generatedBy": "<FILL-IN-TOOL-AND-MODEL>"
    },
    "input": "./input_schema.json",
    "output": "./output_schema.json",
    "storages": {
        "dataset": "./dataset_schema.json"
    },
    "dockerfile": "../Dockerfile"
}
```

## Properties

- `actorSpecification` (integer, required) - Version of Actor specification (currently 1)
- `name` (string, required) - Actor identifier (lowercase, hyphens allowed)
- `title` (string, required) - Human-readable title displayed in UI
- `description` (string, optional) - Actor description for marketplace
- `version` (string, required) - Semantic version number
- `meta` (object, optional) - Metadata about Actor generation
  - `templateId` (string) - ID of template used to create the Actor
  - `generatedBy` (string) - Tool and model name that generated/modified the Actor
- `input` (string, optional) - Path to input schema file
- `output` (string, optional) - Path to output schema file
- `storages` (object, optional) - Storage schema references
  - `dataset` (string) - Path to dataset schema file
  - `keyValueStore` (string) - Path to key-value store schema file
- `dockerfile` (string, optional) - Path to Dockerfile
- `usesStandbyMode` (boolean, optional) - Enable Standby mode
- `webServerSchema` (string or object, optional) - OpenAPI v3 schema for HTTP endpoints

**Important:** Always fill in the `generatedBy` property with the tool and model you're currently using.
