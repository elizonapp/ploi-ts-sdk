# Models

Models are classes parsed from API JSON. Prefer them over `getRawData()`.

## Conventions

- **Getters** use camelCase: `server.ipAddress`
- **Raw attributes** stay snake_case via `toJSON()` / `getAttributes()`: `server.toJSON().ip_address`
- Instances are built with `Model.from(data)` / `Model.fromMany(data)` (also used internally by `ApiResponse`)
- Attributes are frozen after construction

```ts
const site = (await ploi.servers(1).sites(2).get()).getData();

site.domain;              // typed getter
site.getAttributes();     // SiteAttributes
site.toJSON().domain;     // raw field
```

## `ApiResponse<T>`

| Method | Returns |
|--------|---------|
| `getData()` | `T` — model or model array |
| `getModels()` | Explicit list parse |
| `getRawData()` | Unparsed `data` |
| `getJson()` | Full body |
| `getMeta()` | Pagination meta |
| `getLinks()` | Pagination links |
| `getMessage()` | Optional `message` |
| `getDataId()` | `data.id` or top-level `id` |
| `as(Factory)` | Re-wrap with another model factory |

List endpoints attach `listOf(Model)` so `getData()` returns `Model[]`.

## Available models

| Model | Typical source |
|-------|----------------|
| `Server` | `servers().get()` |
| `Site` | `sites().get()` / `create()` |
| `Database` | `databases().get()` |
| `DatabaseUser` | `databases(id).users().get()` |
| `Cronjob` | `cronjobs().get()` |
| `SshKey` | `sshKeys().get()` |
| `Daemon` | `daemons().get()` |
| `NetworkRule` | `networkRules().get()` |
| `SystemUser` | `systemUsers().get()` |
| `Certificate` | `certificates().get()` |
| `Redirect` | `redirects().get()` |
| `QueueWorker` | `queues().get()` |
| `Script` | `scripts().get()` |
| `User` | `user().get()` |
| `Project` | `projects().get()` |
| `StatusPage` | `statusPage().get()` |
| `Incident` | `statusPage(id).incident().get()` |
| `SiteRepository` | `repository().get()` |
| `SiteAliases` | `alias().get()` |
| `SiteTenants` | `tenants().get()` |
| `SiteEnvironment` | `environment().get()` |
| `DeployScript` | `deployment().deployScript()` |
| `DeployResult` | `deployment().deploy()` |
| `AuthUser` | `authUser().get()` |
| `NginxConfiguration` | `nginxConfiguration().get()` |
| `WebserverTemplate` | `webserverTemplates().get()` |
| `Monitor` | `monitors().get()` |
| `Insight` | `insights().get()` |
| `ServerLog` | `servers(id).logs()` |
| `FileBackup` | `fileBackups().get()` |
| `DatabaseBackup` | `databases(id).backups().get()` |

Some action endpoints return `ApiResponse<unknown>` (restart, opcache toggle, …) when the API has no stable entity shape.

## Attribute interfaces

Each model exports an `*Attributes` interface (e.g. `ServerAttributes`) for the raw JSON shape. Use these when you need to type request payloads or custom mapping.
