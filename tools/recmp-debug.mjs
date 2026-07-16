import fs from 'fs';

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
  return d.every((x, i) => x === s[i] || x === '{id}' || s[i] === '{id}');
}

const doc = 'servers/{id}/sites/laravel/horizon';
const sdk = JSON.parse(fs.readFileSync('tools/sdk-endpoints.json', 'utf8'));
const hits = sdk.filter((s) => pathMatch(doc, s.p));
console.log('doc norm:', norm(doc));
console.log(
  'hits',
  hits.map((h) => `${h.m} ${h.p} ${h.loc}`),
);
