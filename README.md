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

const ploi = new Ploi(process.env.PLOI_API_TOKEN!);

const servers: Server[] = (await ploi.servers().get()).getData();
console.log(servers.map((s) => `${s.id} ${s.name} ${s.ipAddress}`));

const site: Site = (await ploi.servers(1).sites(2).get()).getData();
console.log(site.domain, site.phpVersion);

await ploi.servers(1).sites(2).deployment().deploy();
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

## Requirements

Node.js 18+ (native `fetch`)
