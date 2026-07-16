import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const xml = fs.readFileSync(path.join(root, '.tmp-sitemap.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>(https:\/\/developers\.ploi\.io\/[^<]+)<\/loc>/g)].map((m) => m[1]);
const skip =
  /^(getting-started\/(?!teapot|ip-addresses)|cli\/|ploicore\/|insights\/insight-types$)/;
const pages = urls
  .map((u) => u.replace('https://developers.ploi.io/', ''))
  .filter((p) => p && !skip.test(p));

function normalizePath(p) {
  return p.replace(/\{[^}]+\}/g, '{id}').split('?')[0];
}

async function scrape(page) {
  const r = await fetch(`https://developers.ploi.io/${page}`);
  const raw = await r.text();
  const t = raw
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const curls = [
    ...t.matchAll(
      /curl(?:\s+-X\s+([A-Z]+))?\s+(?:-G\s+)?"https:\/\/ploi\.io\/api\/([^"?]+)(?:\?([^"]*))?"/g,
    ),
  ];
  if (!curls.length) return { page, error: 'no curl' };
  const m = curls[0];
  const method = m[1] ?? 'GET';
  const apiPath = normalizePath(m[2]);
  const query = m[3] || '';
  return { page, method, path: apiPath, query };
}

function norm(p) {
  return p.replace(/\{[^}]+\}/g, '{id}');
}

function pathMatch(docPath, sdkPath) {
  const d = norm(docPath).split('/');
  const s = norm(sdkPath).split('/');
  if (d.length !== s.length) return false;
  return d.every((seg, i) => seg === s[i] || (seg === '{id}' && s[i] === '{id}'));
}

// SDK registry from current source (method + normalized path + location)
const sdk = JSON.parse(fs.readFileSync(path.join(__dirname, 'sdk-endpoints.json'), 'utf8'));

const docs = [];
for (const p of pages) {
  docs.push(await scrape(p));
  await new Promise((r) => setTimeout(r, 35));
}

fs.writeFileSync(path.join(root, '.tmp-scraped-endpoints.json'), JSON.stringify(docs, null, 2));

const restDocs = docs.filter((d) => !d.error);
const noCurl = docs.filter((d) => d.error);

const missing = [];
const broken = [];
const matched = [];

for (const doc of restDocs) {
  const docKey = `${doc.method} /${doc.path}`;
  const sdkMatch = sdk.find((s) => s.m === doc.method && pathMatch(doc.path, s.p));
  if (!sdkMatch) {
    const pathOnly = sdk.filter((s) => pathMatch(doc.path, s.p));
    if (pathOnly.length) {
      broken.push({
        page: doc.page,
        docKey,
        sdk: pathOnly.map((x) => `${x.m} /${x.p} → ${x.loc}`).join('; '),
        issue: 'HTTP-Methode weicht ab',
      });
    } else {
      missing.push({ page: doc.page, docKey });
    }
  } else {
    matched.push({ page: doc.page, docKey, sdk: sdkMatch.loc });
  }
}

// SDK endpoints not in docs
const unmatchedSdk = sdk.filter((s) => {
  return !restDocs.some((d) => d.method === s.m && pathMatch(d.path, s.p));
});

const report = {
  summary: {
    docPages: pages.length,
    docEndpoints: restDocs.length,
    noCurlPages: noCurl.length,
    sdkEndpoints: sdk.length,
    matched: matched.length,
    missing: missing.length,
    broken: broken.length,
    extraSdk: unmatchedSdk.length,
  },
  missing,
  broken,
  noCurl,
  unmatchedSdk,
};

fs.writeFileSync(path.join(root, '.tmp-audit-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (missing.length) console.log('\nMISSING:', JSON.stringify(missing, null, 2));
if (broken.length) console.log('\nBROKEN:', JSON.stringify(broken, null, 2));
