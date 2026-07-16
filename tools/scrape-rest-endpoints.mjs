import fs from 'fs';

const xml = fs.readFileSync(
  'C:/Users/Philippe Pflug/.cursor/projects/c-Users-Philippe-Pflug-Documents-ploi-ts-sdk/agent-tools/089f2da9-fbb1-479b-9057-9115c9b0a8f8.txt',
  'utf8',
);

const urls = [...xml.matchAll(/<loc>(https:\/\/developers\.ploi\.io\/[^<]+)<\/loc>/g)].map((m) => m[1]);
const skip =
  /^(getting-started\/(?!teapot|ip-addresses)|cli\/|ploicore\/|insights\/insight-types$)/;

const pages = urls
  .map((u) => u.replace('https://developers.ploi.io/', ''))
  .filter((p) => p && !skip.test(p));

async function scrape(page) {
  const url = `https://developers.ploi.io/${page}`;
  try {
    const r = await fetch(url);
    const raw = await r.text();
    const t = raw
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    const apiMatch = t.match(
      /curl(?:\s+-X\s+([A-Z]+))?\s+(?:-G\s+)?"https:\/\/ploi\.io\/api\/([^"?]+)(?:\?[^"]*)?"/,
    );
    if (apiMatch) {
      const method = apiMatch[1] ?? 'GET';
      return { page, method, path: normalizePath(apiMatch[2]) };
    }
    return { page, error: 'no curl' };
  } catch (e) {
    return { page, error: String(e) };
  }
}

function normalizePath(p) {
  return p.replace(/\{[^}]+\}/g, '{id}').split('?')[0];
}

const out = [];
for (const p of pages) {
  out.push(await scrape(p));
  await new Promise((r) => setTimeout(r, 40));
}

fs.writeFileSync('.tmp-scraped-endpoints.json', JSON.stringify(out, null, 2));
console.log(
  `Scraped ${out.length} pages; ${out.filter((x) => x.error).length} without curl; ${out.filter((x) => !x.error).length} endpoints`,
);
