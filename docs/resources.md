# Resources

Resource classes implement the fluent surface. You normally reach them via `Ploi` — import `Resources` only when you need the class types.

```ts
import { Ploi, Resources } from '@elizonapp/ploi-ts-sdk';

const resource: Resources.ServerResource = new Ploi(token).servers(1);
```

## Root accessors (`Ploi`)

| Method | Resource |
|--------|----------|
| `server(id?)` / `servers(id?)` | `ServerResource` |
| `project(id?)` / `projects(id?)` | `ProjectResource` |
| `scripts(id?)` | `ScriptResource` |
| `statusPage(id?)` | `StatusPageResource` |
| `user()` | `UserResource` |
| `webserverTemplates(id?)` | `WebserverTemplateResource` |
| `fileBackup(id?)` / `fileBackups(id?)` | `FileBackupResource` |

## Nested tree

```
servers(id)
├── sites(id)
│   ├── redirects / certificates / queues / authUser / monitors
│   ├── repository / deployment / environment / alias / fastCgi
│   ├── robots / tenants / nginxConfiguration / app
├── databases(id)
│   ├── users / backups
├── services(name) / cronjobs / networkRules / systemUsers
├── daemons / sshKeys / opcache / insights / loadBalancer
```

## Common patterns

### ID chaining

```ts
await ploi.servers(1).get();
await ploi.servers().get(1); // equivalent for get()
```

Mutating calls without an ID throw `RequiresId`:

```ts
await ploi.servers().delete(); // throws RequiresId
```

### Pagination & search

Resources that list entities support:

```ts
await ploi.servers().perPage(25).page(2);
await ploi.servers().search('edge');
```

### Create → ID sticky

Successful `create()` parses the response model and stores `id` on the resource instance for follow-up calls.

## PHP parity

Method names, argument order, and endpoints match [`ploi/ploi-php-sdk`](https://github.com/ploi/ploi-php-sdk). Differences:

- All API methods are `async` and return `Promise<ApiResponse<T>>`
- Models replace untyped `stdClass`
- Resource classes are named `*Resource` to avoid clashing with models
