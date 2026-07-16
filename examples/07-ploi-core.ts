/**
 * Ploi Core (self-hosted panel) — list users, sites, and packages.
 *
 *   PLOI_CORE_TOKEN=xxx PLOI_CORE_BASE_URL=https://panel.example.com/api npx tsx examples/07-ploi-core.ts
 */
import { PloiCore, CoreUser, CoreSite, CorePackage } from '../dist/index.js';

async function main() {
  const token = process.env.PLOI_CORE_TOKEN;
  const baseUrl = process.env.PLOI_CORE_BASE_URL;

  if (!token) {
    throw new Error('Set PLOI_CORE_TOKEN in the environment');
  }
  if (!baseUrl) {
    throw new Error('Set PLOI_CORE_BASE_URL (e.g. https://panel.example.com/api)');
  }

  const core = new PloiCore(token, {
    baseUrl,
    userAgent: 'ploi-ts-sdk-example',
  });

  const users: CoreUser[] = (await core.users().get()).getData();
  console.log(`Users: ${users.length}`);
  for (const user of users) {
    console.log(`- #${user.id} ${user.name} <${user.email}>`);
  }

  const sites: CoreSite[] = (await core.sites().get()).getData();
  console.log(`Sites: ${sites.length}`);
  for (const site of sites.slice(0, 5)) {
    console.log(`- #${site.id} ${site.domain} (server ${site.serverId}, user ${site.userId})`);
  }

  const packages: CorePackage[] = (await core.packages().get()).getData();
  console.log(`Packages: ${packages.length}`);
  for (const pkg of packages) {
    console.log(`- #${pkg.id} ${pkg.name} (max servers: ${pkg.maximumServers}, max sites: ${pkg.maximumSites})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
