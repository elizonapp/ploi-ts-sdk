import { Server, Site, ApiResponse, listOf } from '../dist/index.js';

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

console.log('model smoke tests ok');
