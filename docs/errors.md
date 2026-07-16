# Errors & authentication

## Authentication

```ts
const ploi = new Ploi(token);
ploi.getApiToken(); // throws if unset
```

HTTP requests send:

```
Authorization: Bearer <token>
Accept: application/json
Content-Type: application/json
User-Agent: <configured or @elizonapp/ploi-ts-sdk/1.0.0>
```

Invalid/missing tokens typically surface as `Unauthenticated` (401).

## Rate limiting (429)

The rate-limit pool is **global for the whole API** (not per resource). Docker, sites, servers, backups, etc. all share one queue via `makeAPICall`. Default pool is process-wide (`rateLimitPool: true`).

On `TooManyAttempts`, that call is retried every 1s until success, then the remaining queue bursts again. Disable with `rateLimitPool: false` to receive the exception immediately. Use `rateLimitPool: 'instance'` for a private pool per `Ploi` client.

`TooManyAttempts` exposes `retryAfter`, `rateLimitLimit`, and `rateLimitRemaining` from response headers when present.

This is unrelated to Laravel site queue workers (`ploi.servers(id).sites(id).queues()`).

## HTTP exceptions

Thrown from `makeAPICall` based on status code:

| Status | Class |
|--------|-------|
| 401 | `Unauthenticated` |
| 404 | `NotFound` |
| 405 | `NotAllowed` |
| 422 | `NotValid` |
| 429 | `TooManyAttempts` |
| 500 | `InternalServerError` |
| 503 | `PerformingMaintenance` |

The exception `message` is the response body string when present.

```ts
import { NotFound, NotValid, Unauthenticated } from '@elizonapp/ploi-ts-sdk';

try {
  await ploi.servers(999).get();
} catch (error) {
  if (error instanceof NotFound) {
    // missing resource
  } else if (error instanceof Unauthenticated) {
    // bad token
  } else if (error instanceof NotValid) {
    // validation payload in error.message (JSON string)
  } else {
    throw error;
  }
}
```

## Client-side exceptions

| Class | When |
|-------|------|
| `RequiresId` | Action needs a resource ID that was never set |
| `RequiresServiceName` | `services().restart()` without a service name |

```ts
import { RequiresId } from '@elizonapp/ploi-ts-sdk';

try {
  await ploi.servers().restart();
} catch (error) {
  if (error instanceof RequiresId) {
    // pass id: ploi.servers(1).restart()
  }
}
```

## App install special case

`sites().app().install()` mirrors the PHP SDK: on `NotValid` it returns the parsed error JSON instead of throwing, so callers can inspect validation errors as data.
