# Examples

Runnable samples for `@elizonapp/ploi-ts-sdk`.

Imports use the local build (`../dist/index.js`). After publishing, switch to `@elizonapp/ploi-ts-sdk`.

## Setup

```bash
npm ci
npm run build
npm install -D tsx   # once
export PLOI_API_TOKEN=your_token
```

## Scripts

| File | Description | Extra env |
|------|-------------|-----------|
| `01-basic.ts` | Auth + list servers | `PLOI_API_TOKEN` |
| `02-servers.ts` | Server detail, logs, RequiresId | `PLOI_API_TOKEN` |
| `03-sites.ts` | List sites, env, aliases, repo | `PLOI_SERVER_ID`, optional `PLOI_CREATE_SITE=1` + `PLOI_SITE_DOMAIN` |
| `04-deploy.ts` | Deploy script + optional deploy | `PLOI_SERVER_ID`, `PLOI_SITE_ID`, optional `PLOI_DEPLOY=1` |
| `05-databases.ts` | Databases + users | `PLOI_SERVER_ID` |
| `06-errors.ts` | Exception handling | `PLOI_API_TOKEN` |
| `07-ploi-core.ts` | Ploi Core panel API | `PLOI_CORE_TOKEN`, `PLOI_CORE_BASE_URL` |

```bash
npx tsx examples/01-basic.ts
npx tsx examples/07-ploi-core.ts
```

Destructive actions (create site, deploy) are gated behind explicit env flags.
