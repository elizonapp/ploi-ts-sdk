import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const ROUTE = new Set(
  `teapot ips user scripts schedules actions status-pages incident incidents webserver-templates projects servers custom monitored logs databases users attach crontabs network-rules daemons system-users services install wp-cli run uninstall refresh-opcache enable-opcache disable-opcache php versions cli-version ssh-keys load-balancer request-certificate revoke-certificate insights detail automatically-fix ignore sites log test-domain suspend resume laravel horizon nginx-configuration clone permission-reset deploy script deploy-to-production repository custom-deployments quick-deploy env queues toggle-pause restart redirects certificates auth-users aliases tenants monitors uptime-responses wordpress complete-install plugins activate deactivate update delete themes toggle-xmlrpc search-replace repositories deploy-all deploy-script fastcgi-cache enable disable flush docker containers up down link unlink site backups database file forget duplicate acknowledge toggle rotate-secret synchronize server-providers backup-configurations source-control opcache nextcloud statamic statistics`.split(
    ' ',
  ),
);

function normSeg(seg) {
  if (/^\{.*\}$/.test(seg) || /^\d+$/.test(seg)) return '{id}';
  if (ROUTE.has(seg)) return seg;
  return '{id}';
}

function norm(p) {
  return p
    .replace(/\{[^}]+\}/g, '{id}')
    .split('/')
    .map(normSeg)
    .join('/');
}

function pathMatch(a, b) {
  const d = norm(a).split('/');
  const s = norm(b).split('/');
  if (d.length !== s.length) return false;
  return d.every((x, i) => {
    if (x === s[i]) return true;
    // Only allow {id} wildcard when the other side is a concrete route keyword mismatch
    if (x === '{id}' && ROUTE.has(s[i])) return false;
    if (s[i] === '{id}' && ROUTE.has(x)) return false;
    return x === '{id}' || s[i] === '{id}';
  });
}

const docs = JSON.parse(fs.readFileSync(path.join(root, '.tmp-scraped-endpoints.json'), 'utf8'));
const sdk = JSON.parse(fs.readFileSync(path.join(__dirname, 'sdk-endpoints.json'), 'utf8'));

const missing = [];
const broken = [];
const ambiguous = [];
const matched = [];

for (const doc of docs.filter((d) => !d.error)) {
  const hits = sdk.filter((s) => pathMatch(doc.path, s.p));
  const methodHits = hits.filter((s) => s.m === doc.method);

  if (methodHits.length === 1) {
    matched.push({ page: doc.page, doc: `${doc.method} /${doc.path}`, sdk: methodHits[0].loc });
  } else if (methodHits.length > 1) {
    ambiguous.push({ page: doc.page, doc: `${doc.method} /${doc.path}`, hits: methodHits });
  } else if (hits.length === 1) {
    broken.push({
      page: doc.page,
      doc: `${doc.method} /${doc.path}`,
      sdk: `${hits[0].m} /${hits[0].p} → ${hits[0].loc}`,
    });
  } else if (hits.length > 1) {
    ambiguous.push({ page: doc.page, doc: `${doc.method} /${doc.path}`, hits });
  } else {
    missing.push({ page: doc.page, doc: `${doc.method} /${doc.path}` });
  }
}

const unmatchedSdk = sdk.filter(
  (s) => !docs.some((d) => !d.error && d.method === s.m && pathMatch(d.path, s.p)),
);

console.log(
  JSON.stringify(
    {
      matched: matched.length,
      missing: missing.length,
      broken: broken.length,
      ambiguous: ambiguous.length,
      unmatchedSdk: unmatchedSdk.length,
      missing,
      broken,
      ambiguous,
      unmatchedSdk,
    },
    null,
    2,
  ),
);
