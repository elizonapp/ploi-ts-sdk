import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const text = fs.readFileSync(path.join(__dirname, 'compare-endpoints.mjs'), 'utf8');
const block = text.match(/const sdk = \[([\s\S]*?)\n\];/)[1];
// eslint-disable-next-line no-eval
const sdk = eval(`[${block}]`);

// Fix known divergences from compare-endpoints stale registry
const fixes = {
  'DELETE status-pages/{id}/incidents/{id}': {
    m: 'DELETE',
    p: 'status-pages/{id}/incident/{id}',
    loc: 'IncidentResource.delete()',
  },
  'GET servers/{id}/sites/laravel/horizon': {
    m: 'GET',
    p: 'servers/{id}/sites/{id}/laravel/horizon/{id}',
    loc: 'SiteResource.horizonStatistics(type)',
  },
};

const normalized = sdk.map((entry) => {
  const key = `${entry.m} ${entry.p}`;
  if (fixes[key]) return fixes[key];
  return entry;
});

// Add endpoints missing from compare-endpoints
normalized.push(
  { m: 'GET', p: 'user/statistics', loc: 'UserResource.statistics()' },
  { m: 'GET', p: 'synchronize/servers', loc: 'SynchronizeResource.servers()' },
  { m: 'PATCH', p: 'backups/database/{id}/toggle', loc: 'DatabaseBackupResource.toggle()' },
);

fs.writeFileSync(
  path.join(__dirname, 'sdk-endpoints.json'),
  JSON.stringify(normalized, null, 2),
);
console.log('Wrote', normalized.length, 'SDK endpoints');
