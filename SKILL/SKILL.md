---
name: ploi-ts-sdk
description: >-
  Use and extend the @elizonapp/ploi-ts-sdk TypeScript client for the Ploi.io API.
  Apply when writing Ploi integrations, calling ploi.servers/sites/databases,
  adding SDK resources/models, or when the user mentions ploi-ts-sdk, Ploi API, or
  ploi/ploi-php-sdk parity.
---

# Ploi TypeScript SDK

## Quick rules

1. Import from `@elizonapp/ploi-ts-sdk` (models + `Ploi`), not raw `fetch` to `ploi.io/api`.
2. Always use **typed models** via `response.getData()` — never treat API JSON as `any` in app code.
3. Resource classes are `*Resource` (fluent builders). Domain types are models (`Server`, `Site`, …).
4. Keep PHP SDK method names / argument order / endpoints when adding features.
5. All API methods are `async` and return `Promise<ApiResponse<T>>`.

## Client usage

```ts
import { Ploi, Server, Site, NotFound, RequiresId } from '@elizonapp/ploi-ts-sdk';

const ploi = new Ploi(process.env.PLOI_API_TOKEN!);

const servers: Server[] = (await ploi.servers().get()).getData();
const site: Site = (await ploi.servers(1).sites(2).get()).getData();

await ploi.servers(1).sites(2).deployment().deploy();
```

Fluent tree (abbrev.):

```
ploi.servers(id).sites(id).{deployment,repository,environment,alias,...}
ploi.servers(id).databases(id).{users,backups}
ploi.scripts / projects / statusPage / user / fileBackups / webserverTemplates
```

## Responses

| Call | Use |
|------|-----|
| `getData()` | Typed model / model[] |
| `getMeta()` / `getLinks()` | Pagination |
| `getRawData()` | Escape hatch only |
| `getDataId()` | After create, sticky resource id |

List `get()` → `Model[]`. `get(id)` → `Model`. Overloads encode this.

## Errors

Catch SDK exceptions (`Unauthenticated`, `NotFound`, `NotValid`, `RequiresId`, …). Do not invent ad-hoc status handling around `fetch`.

## Extending the SDK

When adding an endpoint:

1. Add/extend a **model** in `src/models/` (`from` / `fromMany`, camelCase getters, `*Attributes`).
2. Add/extend a **resource** in `src/resources/` named `FooResource`.
3. Pass the model (or `listOf(Model)`) as the 4th arg to `makeAPICall` / `api()`.
4. Export model from `src/models/index.ts`; resource from `src/resources/index.ts`.
5. Run `npm run typecheck && npm run build && npm run smoke`.

Do **not** export resource class names at the package root (they clash with models). Use `export * as Resources`.

## Docs in this repo

- [docs/getting-started.md](../../../docs/getting-started.md)
- [docs/models.md](../../../docs/models.md)
- [docs/resources.md](../../../docs/resources.md)
- [docs/errors.md](../../../docs/errors.md)
- [examples/](../../../examples/)

## Additional resources

- Detailed resource/method checklist: [reference.md](reference.md)
- Copy-paste snippets: [examples.md](examples.md)
