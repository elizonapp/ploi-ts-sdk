/**
 * Sites: list, create (optional), update, nested accessors.
 *
 *   PLOI_API_TOKEN=xxx PLOI_SERVER_ID=123 npx tsx examples/03-sites.ts
 *   PLOI_CREATE_SITE=1 PLOI_SITE_DOMAIN=demo.example.com ...  # also creates a site
 */
import { Ploi, Site } from '../dist/index.js';

async function main() {
  const ploi = new Ploi(requiredEnv('PLOI_API_TOKEN'));
  const serverId = Number(requiredEnv('PLOI_SERVER_ID'));

  const sites: Site[] = (await ploi.servers(serverId).sites().get()).getData();
  console.log(`Sites on server #${serverId}: ${sites.length}`);
  for (const site of sites) {
    console.log(`- #${site.id} ${site.domain} php=${site.phpVersion} repo=${site.hasRepository}`);
  }

  if (process.env.PLOI_CREATE_SITE === '1') {
    const domain = requiredEnv('PLOI_SITE_DOMAIN');
    const created = await ploi.servers(serverId).sites().create(domain, '/public');
    const site = created.getData();
    console.log('Created site:', site.id, site.domain);
  }

  const target = sites[0];
  if (!target) return;

  const env = await ploi.servers(serverId).sites(target.id).environment().get();
  console.log('Env length:', env.getData().content.length);

  const aliases = await ploi.servers(serverId).sites(target.id).alias().get();
  console.log('Aliases:', aliases.getData().aliases);

  const repo = await ploi.servers(serverId).sites(target.id).repository().get();
  console.log('Repository:', repo.getData().repository);
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name}`);
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
