# Actor logging reference

## JavaScript and TypeScript

**ALWAYS use the `apify/log` package for logging** - censors sensitive data (tokens, API keys, credentials).

### Available log levels
- `log.debug()` - Detailed diagnostic information
- `log.info()` - General informational messages
- `log.warning()` - Potentially problematic situations
- `log.warningOnce()` - Warning logged only once
- `log.error()` - Error messages
- `log.exception()` - Exceptions with stack traces
- `log.perf()` - Performance metrics
- `log.deprecated()` - Deprecation warnings
- `log.softFail()` - Non-critical failures
- `log.internal()` - Internal/system messages

## Python

**ALWAYS use `Actor.log` for logging** - censors sensitive data.

### Available log levels
- `Actor.log.debug()`, `Actor.log.info()`, `Actor.log.warning()`, `Actor.log.error()`, `Actor.log.exception()`
