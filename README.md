# Ploi TypeScript SDK

Type-safe TypeScript client for the [Ploi.io](https://ploi.io) API.

- Official API: https://developers.ploi.io  
- Package: `@elizonapp/ploi-ts-sdk` (GitHub Packages)

## Install

```bash
npm install @elizonapp/ploi-ts-sdk --registry=https://npm.pkg.github.com
```

`.npmrc`:

```
@elizonapp:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Token needs `read:packages`.

## Quick start

```ts
import { Ploi, Server, Site } from '@elizonapp/ploi-ts-sdk';

const ploi = new Ploi(process.env.PLOI_API_TOKEN!, {
  userAgent: 'my-app', // required by Ploi; default is package name
});

const servers: Server[] = (await ploi.servers().get()).getData();
console.log(servers.map((s) => `${s.id} ${s.name} ${s.ipAddress}`));

const site: Site = (await ploi.servers(1).sites(2).get()).getData();
console.log(site.domain, site.phpVersion);

await ploi.servers(1).sites(2).deployment().deploy();
```

### Rate-limit pool

By default every API call goes through a reactive pool: requests burst in parallel; on HTTP 429 the failed call is retried every 1s, then the remaining queue bursts again.

```ts
new Ploi(token, {
  rateLimitPool: true,              // default
  rateLimitRetryIntervalMs: 1000,   // default
});
```

## Documentation

| | |
|--|--|
| [Getting started](docs/getting-started.md) | Install, client, first request |
| [Models](docs/models.md) | Typed models & `ApiResponse` |
| [Resources](docs/resources.md) | Fluent API map |
| [Errors](docs/errors.md) | Auth & exceptions |
| [Examples](examples/README.md) | Runnable scripts |

## Examples

```bash
npm run build
export PLOI_API_TOKEN=...
npx tsx examples/01-basic.ts
```

| Script | Purpose |
|--------|---------|
| `examples/01-basic.ts` | Auth + list servers |
| `examples/02-servers.ts` | Server detail / logs |
| `examples/03-sites.ts` | Sites, env, aliases |
| `examples/04-deploy.ts` | Deploy script / deploy |
| `examples/05-databases.ts` | Databases + users |
| `examples/06-errors.ts` | Exception handling |

Destructive steps are opt-in via env flags (`PLOI_CREATE_SITE`, `PLOI_DEPLOY`).

## Architecture

```
Ploi  →  *Resource (fluent)  →  ApiResponse<T>  →  Model (Server, Site, …)
```

- **Models** — camelCase getters, snake_case via `toJSON()`
- **Resources** — PHP-compatible method names; import as `Resources.ServerResource` if needed
- **Exceptions** — `NotFound`, `NotValid`, `RequiresId`, …

## Develop

```bash
npm ci
npm run typecheck
npm run build
npm run smoke
```

## Release & publish

Same pattern as [`api-client-typescript`](https://github.com/elizonapp/api-client-typescript/blob/main/.github/workflows/reusable-publish.yml):

On every push to `main` / `master`, Actions:

1. Builds and uploads `dist`
2. Publishes `@elizonapp/ploi-ts-sdk@{base}-{run_id}` to GitHub Packages (unique version, no E409)
3. Creates a GitHub Release with the same version tag

PRs only run the build job.

## Requirements

Node.js 18+ (native `fetch`)

## License

MIT
