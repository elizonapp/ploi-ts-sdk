/**
 * Server CRUD-ish operations with typed models.
 *
 *   PLOI_API_TOKEN=xxx npx tsx examples/02-servers.ts
 */
import { Ploi, RequiresId, Server } from '../dist/index.js';

async function main() {
  const ploi = new Ploi(requiredToken());

  // Search
  const found = await ploi.servers().search('prod');
  console.log('Search hits:', found.getData().map((s) => s.name));

  // Resolve first server for read-only demos
  const list = (await ploi.servers().get()).getData();
  const first = list[0];
  if (!first) {
    console.log('No servers in account — skipping detail calls');
    return;
  }

  const detail: Server = (await ploi.servers(first.id).get()).getData();
  console.log('Detail:', {
    id: detail.id,
    name: detail.name,
    php: detail.phpVersion,
    mysql: detail.mysqlVersion,
    sites: detail.sitesCount,
    monitoring: detail.monitoring,
  });

  const logs = await ploi.servers(first.id).logs();
  console.log('Recent logs:', logs.getData().slice(0, 3));

  const versions = await ploi.servers(first.id).phpVersions();
  console.log('PHP versions:', versions.getRawData());

  // RequiresId when no ID is set
  try {
    await ploi.servers().delete();
  } catch (error) {
    if (error instanceof RequiresId) {
      console.log('Expected RequiresId:', error.message);
    } else {
      throw error;
    }
  }
}

function requiredToken(): string {
  const token = process.env.PLOI_API_TOKEN;
  if (!token) throw new Error('Set PLOI_API_TOKEN');
  return token;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
