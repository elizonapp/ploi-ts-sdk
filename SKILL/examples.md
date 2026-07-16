# Snippets

## List + single

```ts
const list = (await ploi.servers().get()).getData(); // Server[]
const one = (await ploi.servers(list[0]!.id).get()).getData(); // Server
console.log(one.name, one.ipAddress, one.phpVersion);
```

## Create site + deploy

```ts
const created = await ploi.servers(serverId).sites().create('app.example.com', '/public');
const site = created.getData();

await ploi.servers(serverId).sites(site.id).repository().install('github', 'main', 'org/repo');
await ploi.servers(serverId).sites(site.id).deployment().deploy();
```

## Pagination

```ts
const page = await ploi.servers().perPage(15).page(1);
console.log(page.getMeta()?.total, page.getData().length);
```

## Error handling

```ts
import { NotFound, RequiresId, NotValid } from '@elizonapp/ploi-ts-sdk';

try {
  await ploi.servers(id).sites(siteId).update('new.example.com');
} catch (e) {
  if (e instanceof RequiresId) { /* missing id */ }
  else if (e instanceof NotFound) { /* 404 */ }
  else if (e instanceof NotValid) { /* 422 body in e.message */ }
  else throw e;
}
```

## Local examples

```bash
npm run build
PLOI_API_TOKEN=... npx tsx examples/01-basic.ts
```
