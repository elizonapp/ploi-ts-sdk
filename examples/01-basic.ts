/**
 * Basic client setup and typed user/server listing.
 *
 *   PLOI_API_TOKEN=xxx npx tsx examples/01-basic.ts
 */
import { Ploi, Server, User } from '../dist/index.js';

async function main() {
  const token = process.env.PLOI_API_TOKEN;
  if (!token) {
    throw new Error('Set PLOI_API_TOKEN in the environment');
  }

  const ploi = new Ploi(token);

  const me: User = (await ploi.user().get()).getData();
  console.log(`Authenticated as ${me.name} <${me.email}> (${me.plan})`);

  const response = await ploi.servers().perPage(10).page(1);
  const servers: Server[] = response.getData();
  const meta = response.getMeta();

  console.log(`Servers: ${meta?.total ?? servers.length}`);
  for (const server of servers) {
    console.log(`- #${server.id} ${server.name} (${server.ipAddress}) [${server.status}]`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
