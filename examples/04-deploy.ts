/**
 * Deploy a site and inspect / update the deploy script.
 *
 *   PLOI_API_TOKEN=xxx PLOI_SERVER_ID=1 PLOI_SITE_ID=2 npx tsx examples/04-deploy.ts
 *   PLOI_DEPLOY=1 ...   # actually trigger deploy
 */
import { Ploi } from '../dist/index.js';

async function main() {
  const ploi = new Ploi(requiredEnv('PLOI_API_TOKEN'));
  const serverId = Number(requiredEnv('PLOI_SERVER_ID'));
  const siteId = Number(requiredEnv('PLOI_SITE_ID'));

  const deployment = ploi.servers(serverId).sites(siteId).deployment();

  const script = await deployment.deployScript();
  console.log('Current deploy script:\n', script.getData().deployScript);

  if (process.env.PLOI_DEPLOY === '1') {
    const result = await deployment.deploy();
    console.log('Deploy:', result.getData().message);
  } else {
    console.log('Dry run — set PLOI_DEPLOY=1 to trigger a real deploy');
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
