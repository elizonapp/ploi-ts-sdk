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

const ploi = new Ploi(process.env.PLOI_API_TOKEN!);
// or
const ploi2 = new Ploi();
ploi2.setApiToken(process.env.PLOI_API_TOKEN!);
```

API base URL: `https://ploi.io/api/`  
Auth header: `Authorization: Bearer <token>`

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
