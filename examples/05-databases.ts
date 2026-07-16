/**
 * Databases and database users on a server.
 *
 *   PLOI_API_TOKEN=xxx PLOI_SERVER_ID=1 npx tsx examples/05-databases.ts
 */
import { Ploi, Database, DatabaseUser } from '../dist/index.js';

async function main() {
  const ploi = new Ploi(requiredEnv('PLOI_API_TOKEN'));
  const serverId = Number(requiredEnv('PLOI_SERVER_ID'));

  const databases: Database[] = (await ploi.servers(serverId).databases().get()).getData();
  console.log(`Databases: ${databases.length}`);

  for (const db of databases) {
    console.log(`- #${db.id} ${db.name} (${db.type}) status=${db.status}`);
    if (db.site) {
      console.log(`  linked site: ${db.site.root_domain}`);
    }

    const users: DatabaseUser[] = (
      await ploi.servers(serverId).databases(db.id).users().get()
    ).getData();

    for (const user of users) {
      console.log(`  user #${user.id} ${user.user} remote=${user.remote} readonly=${user.readonly}`);
    }
  }
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
