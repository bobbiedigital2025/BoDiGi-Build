# CLI-based Actorization

For languages without an SDK (Go, Rust, Java, etc.), create a wrapper script using the Apify CLI.

## Create wrapper script

Create `start.sh` in project root:

```bash
#!/bin/bash
set -e

INPUT=$(apify actor:get-input)
MY_PARAM=$(echo "$INPUT" | jq -r '.myParam // "default"')

./your-application --param "$MY_PARAM"

# Push structured data to dataset
# apify actor:push-data '{"result": "value"}'
```

## Update Dockerfile

```dockerfile
FROM apify/actor-node:20

RUN npm install -g apify-cli
RUN apt-get update && apt-get install -y jq

COPY . .
RUN chmod +x start.sh

CMD ["./start.sh"]
```

## CLI commands reference

| Command | Description |
|---------|-------------|
| `apify actor:get-input` | Get input JSON from key-value store |
| `apify actor:set-value KEY` | Store value in key-value store |
| `apify actor:push-data JSON` | Push data to dataset |
| `apify actor:get-value KEY` | Retrieve value from key-value store |
