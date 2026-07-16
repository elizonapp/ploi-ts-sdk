# Ploi TS SDK — reference

## Package

- Name: `@elizonapp/ploi-ts-sdk`
- Registry: GitHub Packages (`https://npm.pkg.github.com`)
- Runtime: Node 18+ (`fetch`)
- Entry: `Ploi` client, models, exceptions, `ApiResponse`, `Resources` namespace

## Official API

https://developers.ploi.io

PHP reference (behavior/endpoints): https://github.com/ploi/ploi-php-sdk

## Model ↔ resource map

| Model | Resource accessor |
|-------|-------------------|
| `Server` | `ploi.servers()` |
| `Site` | `servers().sites()` |
| `Database` | `servers().databases()` |
| `DatabaseUser` | `databases().users()` |
| `DatabaseBackup` | `databases().backups()` |
| `Cronjob` | `servers().cronjobs()` |
| `NetworkRule` | `servers().networkRules()` |
| `SystemUser` | `servers().systemUsers()` |
| `Daemon` | `servers().daemons()` |
| `SshKey` | `servers().sshKeys()` |
| `Insight` | `servers().insights()` |
| `Certificate` | `sites().certificates()` |
| `Redirect` | `sites().redirects()` |
| `QueueWorker` | `sites().queues()` |
| `AuthUser` | `sites().authUser()` |
| `Monitor` | `sites().monitors()` |
| `SiteRepository` | `sites().repository()` |
| `SiteEnvironment` | `sites().environment()` |
| `SiteAliases` | `sites().alias()` |
| `SiteTenants` | `sites().tenants()` |
| `NginxConfiguration` | `sites().nginxConfiguration()` |
| `DeployScript` / `DeployResult` | `sites().deployment()` |
| `Script` | `ploi.scripts()` |
| `Project` | `ploi.projects()` |
| `User` | `ploi.user()` |
| `StatusPage` | `ploi.statusPage()` |
| `Incident` | `statusPage().incident()` |
| `WebserverTemplate` | `ploi.webserverTemplates()` |
| `FileBackup` | `ploi.fileBackups()` |
| `ServerLog` | `servers().logs()` |

Action-only (often `ApiResponse<unknown>`): `opcache`, `fastCgi`, `robots`, `services`, `loadBalancer`, `synchronize`.

## HTTP exception map

401 `Unauthenticated` · 404 `NotFound` · 405 `NotAllowed` · 422 `NotValid` · 429 `TooManyAttempts` · 500 `InternalServerError` · 503 `PerformingMaintenance`

## Publish

`.github/workflows/publish.yml` — on release or workflow_dispatch → `npm publish` to GitHub Packages with `NODE_AUTH_TOKEN`.
