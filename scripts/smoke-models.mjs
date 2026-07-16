import {
  Server,
  Site,
  ApiResponse,
  listOf,
  CoreUser,
  CoreSite,
  CorePackage,
  Ploi,
  PloiCore,
  normalizeBaseUrl,
} from '../dist/index.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const serverJson = {
  id: 1,
  status: 'active',
  type: 'server',
  name: 'awesome-server',
  ip_address: '127.0.0.1',
  php_version: 8.3,
  mysql_version: 8.0,
  sites_count: 2,
  created_at: '2019-01-01 09:00:00',
};

const server = Server.from(serverJson);
assert(server.id === 1, 'server.id');
assert(server.name === 'awesome-server', 'server.name');
assert(server.ipAddress === '127.0.0.1', 'server.ipAddress');
assert(server.toJSON().ip_address === '127.0.0.1', 'server.toJSON');

const site = Site.from({
  id: 10,
  server_id: 1,
  domain: 'example.com',
  deploy_script: false,
  web_directory: '/public',
  project_type: 'laravel',
  project_root: '/',
  last_deploy_at: null,
  system_user: 'ploi',
  php_version: '8.3',
  health_url: null,
  has_repository: true,
  created_at: '2019-07-29 10:27:32',
});
assert(site.domain === 'example.com', 'site.domain');
assert(site.serverId === 1, 'site.serverId');

const body = JSON.stringify({
  data: [serverJson],
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    path: '/',
    per_page: 15,
    to: 1,
    total: 1,
  },
  links: { first: '/', last: '/', prev: null, next: null },
});

const api = new ApiResponse(new Response(body, { status: 200 }), body, listOf(Server));
const list = api.getData();
assert(Array.isArray(list) && list[0] instanceof Server, 'listOf Server');
assert(list[0].name === 'awesome-server', 'list[0].name');
assert(api.getMeta()?.total === 1, 'meta.total');

const coreUser = CoreUser.from({
  id: 1,
  avatar: 'https://example.com/avatar',
  name: 'John Doe',
  email: 'john@doe.com',
  package_id: null,
  blocked: null,
  created_at: '2022-07-23T13:35:51.000000Z',
});
assert(coreUser.name === 'John Doe', 'coreUser.name');
assert(coreUser.packageId === null, 'coreUser.packageId');

const coreSite = CoreSite.from({
  id: 2,
  status: 'active',
  server_id: 146,
  domain: 'domain.com',
  user_id: '120',
  created_at: '2022-07-23T13:35:51.000000Z',
});
assert(coreSite.domain === 'domain.com', 'coreSite.domain');
assert(coreSite.userId === '120', 'coreSite.userId');

const corePackage = CorePackage.from({
  id: 1,
  name: 'Basic',
  maximum_servers: 1,
  maximum_sites: 3,
  price_hourly: 0,
  price_monthly: 0,
  price_yearly: 0,
  stripe_plan_id: null,
  currency: 'usd',
  server_permissions: { create: false, update: false, delete: false },
  site_permissions: { create: true, update: true, delete: true },
  created_at: '2022-07-23T13:35:51.000000Z',
});
assert(corePackage.maximumSites === 3, 'corePackage.maximumSites');
assert(corePackage.sitePermissions.create === true, 'corePackage.sitePermissions.create');

assert(normalizeBaseUrl('https://panel.example.com/api') === 'https://panel.example.com/api/', 'normalizeBaseUrl');

const ploi = new Ploi('token', { baseUrl: 'https://panel.example.com/api' });
assert(ploi.getBaseUrl() === 'https://panel.example.com/api/', 'ploi.getBaseUrl');

try {
  new PloiCore('', { baseUrl: '' });
  throw new Error('PloiCore should require baseUrl');
} catch (error) {
  assert(error.message.includes('baseUrl'), 'PloiCore baseUrl required');
}

const core = new PloiCore('token', { baseUrl: 'https://panel.example.com/api' });
assert(core.getBaseUrl() === 'https://panel.example.com/api/', 'PloiCore.getBaseUrl');

console.log('model smoke tests ok');
