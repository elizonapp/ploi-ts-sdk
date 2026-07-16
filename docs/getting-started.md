# Getting started

## Install

```bash
npm install @elizonapp/ploi-ts-sdk --registry=https://npm.pkg.github.com
```

Create `.npmrc` in your project (or user home):

```
@elizonapp:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

A GitHub PAT with `read:packages` is required.

## Create a client

```ts
import { Ploi } from '@elizonapp/ploi-ts-sdk';

const ploi = new Ploi(process.env.PLOI_API_TOKEN!, {
  userAgent: 'my-app',
});
// or
const ploi2 = new Ploi();
ploi2.setApiToken(process.env.PLOI_API_TOKEN!);
```

API base URL: `https://ploi.io/api/` (override with `{ baseUrl: '...' }` or `setBaseUrl()`)
Auth header: `Authorization: Bearer <token>`
User-Agent: required by Ploi (defaults to `@elizonapp/ploi-ts-sdk/1.0.0`)

Requests are queued through a reactive rate-limit pool (burst → 429 retry every 1s → burst). Disable with `{ rateLimitPool: false }`.

## Ploi Core (self-hosted panel)

For a [Ploi Core](https://developers.ploi.io/ploicore/core-api/introduction) installation, use `PloiCore` with your panel URL:

```ts
import { PloiCore, CoreUser, CoreSite } from '@elizonapp/ploi-ts-sdk';

const core = new PloiCore(process.env.PLOI_CORE_TOKEN!, {
  baseUrl: 'https://panel.example.com/api',
  userAgent: 'my-app',
});

const users: CoreUser[] = (await core.users().get()).getData();
const site: CoreSite = (
  await core.sites().create({
    server_id: 146,
    domain: 'domain.com',
    user_id: 120,
  })
).getData();
```

Core API surface: `users()`, `sites()`, `servers()` (create only), `packages()`. Models are prefixed `Core*` to avoid clashing with the cloud API types.

## First call

```ts
import { Ploi, Server } from '@elizonapp/ploi-ts-sdk';

const ploi = new Ploi(process.env.PLOI_API_TOKEN!);

const response = await ploi.servers().get();
const servers: Server[] = response.getData();

for (const server of servers) {
  console.log(server.id, server.name, server.ipAddress);
}
```

## Mental model

| Layer | Role |
|-------|------|
| `Ploi` | Entry point / HTTP client |
| `*Resource` | Fluent API builders (`ploi.servers(1).sites()`) |
| `ApiResponse<T>` | Typed HTTP wrapper |
| Model classes (`Server`, `Site`, …) | Parsed domain objects from `getData()` |

Fluent chaining mirrors the [PHP SDK](https://github.com/ploi/ploi-php-sdk):

```ts
await ploi.servers(1).sites(2).deployment().deploy();
await ploi.servers(1).databases().create('app', 'user', 'secret');
```

## Next

- [Authentication & errors](./errors.md)
- [Models](./models.md)
- [Resources API map](./resources.md)
- [Examples](../examples/README.md)
