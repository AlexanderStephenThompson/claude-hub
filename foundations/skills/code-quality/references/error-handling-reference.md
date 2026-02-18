# Error Handling Reference

Error hierarchies, custom exceptions, retry/fallback patterns, error boundaries, and resource cleanup.

---

## Error Hierarchies

### Design Custom Exceptions

Build a hierarchy rooted in a base application error:

```python
class AppError(Exception):
    """Base exception for application errors."""
    def __init__(self, message: str, code: str):
        self.message = message
        self.code = code
        super().__init__(message)

class NotFoundError(AppError):
    """Raised when a resource is not found."""
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            f"{resource} with id '{identifier}' not found",
            code="NOT_FOUND"
        )

class ValidationError(AppError):
    """Raised when validation fails."""
    def __init__(self, field: str, reason: str):
        super().__init__(
            f"Validation failed for '{field}': {reason}",
            code="VALIDATION_ERROR"
        )

class AuthorizationError(AppError):
    """Raised when user lacks permission."""
    def __init__(self, action: str):
        super().__init__(
            f"Not authorized to perform: {action}",
            code="UNAUTHORIZED"
        )
```

### Hierarchy Guidelines

| Level | Purpose | Example |
|-------|---------|---------|
| Base error | Catch-all for app errors | `AppError` |
| Category errors | Group by domain | `NotFoundError`, `ValidationError` |
| Specific errors | Precise failure reason | `UserNotFoundError`, `EmailValidationError` |

**Rules:**
- Never catch the language's root exception (`Exception`, `Error`) except at top-level boundaries
- Custom errors carry context (code, field, resource) for proper handling
- Keep hierarchies shallow -- 2-3 levels is usually enough

---

## Catch Patterns

### Catch Specific, Propagate Unknown

```python
try:
    user = get_user(user_id)
except NotFoundError:
    return None
except DatabaseError as e:
    logger.error(f"Database error: {e}")
    raise
# Unexpected errors propagate up naturally
```

### Never Swallow Errors

If you catch an error, you must either:
1. **Handle it** -- take a meaningful recovery action
2. **Log and re-raise it** -- make the failure visible
3. **Transform it** -- wrap in a more specific error for the caller

```python
# BAD - swallows everything
try:
    do_risky_thing()
except Exception:
    pass

# GOOD - handles what it understands
try:
    do_risky_thing()
except NetworkError:
    return retry()
except ValidationError as e:
    return error_response(e.message)
```

### Transform Errors at Boundaries

When crossing module boundaries, translate internal errors to domain errors:

```python
class UserService:
    def get_user(self, user_id):
        try:
            row = self.db.query("SELECT * FROM users WHERE id = %s", (user_id,))
        except DatabaseConnectionError as e:
            raise ServiceUnavailableError("User service temporarily unavailable") from e

        if not row:
            raise UserNotFoundError(user_id)

        return User.from_row(row)
```

---

## Retry Patterns

### Simple Retry with Backoff

```python
import time

MAX_RETRIES = 3
INITIAL_DELAY_SECONDS = 1.0
BACKOFF_MULTIPLIER = 2.0

def retry_with_backoff(operation, max_retries=MAX_RETRIES):
    """Retry an operation with exponential backoff."""
    delay = INITIAL_DELAY_SECONDS

    for attempt in range(max_retries):
        try:
            return operation()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise  # Final attempt, propagate
            time.sleep(delay)
            delay *= BACKOFF_MULTIPLIER
```

### Retry Guidelines

| Aspect | Guideline |
|--------|-----------|
| **What to retry** | Transient failures only (network timeouts, rate limits, temporary unavailability) |
| **What NOT to retry** | Validation errors, auth failures, not-found errors |
| **Max retries** | 3-5 attempts for most cases |
| **Backoff** | Exponential with jitter to avoid thundering herd |
| **Timeout** | Set a total timeout, not just per-attempt |
| **Idempotency** | Only retry idempotent operations (GET, PUT) safely; POST needs care |

---

## Fallback Patterns

### Graceful Degradation

```python
def get_user_preferences(user_id):
    """Get preferences with fallback to defaults."""
    try:
        return preferences_service.get(user_id)
    except ServiceUnavailableError:
        return DEFAULT_PREFERENCES
```

### Circuit Breaker (Conceptual)

When a dependency is failing repeatedly, stop calling it temporarily:

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout_seconds=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout_seconds
        self.is_open = False
        self.last_failure_time = None

    def call(self, operation):
        if self.is_open:
            if self._should_attempt_reset():
                return self._try_operation(operation)
            raise CircuitOpenError("Circuit breaker is open")

        return self._try_operation(operation)
```

| State | Behavior |
|-------|----------|
| **Closed** | Normal operation, tracking failures |
| **Open** | Reject calls immediately, return fallback |
| **Half-open** | Allow one test call to check recovery |

---

## Error Boundaries

### Top-Level Error Handler

Every application should have a top-level boundary that catches unhandled errors:

```python
def main():
    try:
        run_application()
    except KeyboardInterrupt:
        shutdown_gracefully()
    except AppError as e:
        logger.error(f"Application error: {e.code} - {e.message}")
        sys.exit(1)
    except Exception as e:
        logger.critical(f"Unexpected error: {e}", exc_info=True)
        sys.exit(2)
```

### API Boundary

Translate exceptions to appropriate responses at the API layer:

```python
def handle_request(request):
    try:
        result = process(request)
        return success_response(result)
    except ValidationError as e:
        return error_response(400, e.message)
    except NotFoundError as e:
        return error_response(404, e.message)
    except AuthorizationError as e:
        return error_response(403, e.message)
    except AppError as e:
        return error_response(500, "Internal error")
```

### Boundary Rules

- **Log before translating** -- preserve the original error context
- **Never expose internals** -- users see friendly messages, logs get stack traces
- **Map to standard codes** -- use HTTP status codes, error codes, or domain-specific codes consistently

---

## Resource Cleanup

### Always Clean Up Resources

Use language-provided mechanisms to ensure cleanup happens:

```python
# Context manager (Python)
with open("file.txt") as f:
    content = f.read()
# File is closed even if exception occurs

# Custom cleanup
from contextlib import contextmanager

@contextmanager
def database_connection(config):
    connection = create_connection(config)
    try:
        yield connection
    finally:
        connection.close()

with database_connection(config) as db:
    db.query("SELECT 1")
```

### Cleanup Guidelines

- Use context managers, `try/finally`, or language-specific RAII patterns
- Close connections, file handles, and locks in reverse order of acquisition
- Log cleanup failures but don't let them mask the original error

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Empty catch blocks | Errors silently disappear | Handle, log+re-raise, or transform |
| Catching root Exception | Masks unexpected bugs | Catch specific types |
| Error strings instead of types | Can't catch programmatically | Use typed exceptions |
| Retry without backoff | Overwhelms failing service | Add exponential backoff |
| Retry non-idempotent operations | Duplicate side effects | Only retry safe operations |
| Logging without context | Useless error messages | Include operation, inputs, state |
| Re-raising without chain | Loses original stack trace | Use `raise ... from e` |
