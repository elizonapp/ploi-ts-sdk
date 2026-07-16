import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';
import { Server } from '../models/server';
import { ServerLog } from '../models/server-log';
import { Resource } from './resource';
import { SiteResource } from './site';
import { ServiceResource } from './service';
import { DatabaseResource } from './database';
import { CronjobResource } from './cronjob';
import { NetworkRuleResource } from './network-rule';
import { SystemUserResource } from './system-user';
import { DaemonResource } from './daemon';
import { SshKeyResource } from './ssh-key';
import { OpcacheResource } from './opcache';
import { InsightResource } from './insight';
import { LoadBalancerResource } from './load-balancer';
import { DockerContainerResource } from './docker-container';

export class ServerResource extends Resource {
  private readonly resourcePath = 'servers';

  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.setEndpoint(this.resourcePath);
  }

  buildEndpoint(path?: string | null): string {
    let base = this.resourcePath;

    if (this.getId()) {
      base = `${base}/${this.getId()}`;
    }

    if (!path) {
      return base;
    }

    if (path.startsWith('/')) {
      return base + path;
    }

    return `${base}/${path}`;
  }

  async callApi<T = unknown>(
    path?: string | null,
    method: 'get' | 'post' | 'patch' | 'delete' = 'get',
    options?: { body?: string | object },
    factory?: import('../http/response').ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    return this.api(this.buildEndpoint(path), method, options, factory);
  }

  get(): Promise<ApiResponse<Server[]>>;
  get(id: number): Promise<ApiResponse<Server>>;
  async get(id?: number | null): Promise<ApiResponse<Server | Server[]>> {
    if (id != null) {
      this.setId(id);
    }

    if (this.getId() === null) {
      return this.page();
    }

    return this.callApi(null, 'get', {}, Server);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi(null, 'delete');
  }

  async update(
    name: string,
    options: { ip?: string; ssh_port?: number | string } = {},
  ): Promise<ApiResponse<Server>> {
    this.setIdOrFail();
    return this.callApi(null, 'patch', {
      body: { name, ...options },
    }, Server);
  }

  async monitored(): Promise<ApiResponse<unknown>> {
    return this.api('servers/monitored');
  }

  async logs(id?: number | null): Promise<ApiResponse<ServerLog[]>> {
    this.setIdOrFail(id);
    return this.callApi('logs', 'get', {}, listOf(ServerLog));
  }

  async create(
    name: string,
    provider: number,
    region: string | number,
    plan: string | number,
    options: Record<string, unknown> = {},
  ): Promise<ApiResponse<Server>> {
    this.setId(null);

    const defaults = {
      name,
      plan,
      region,
      credential: provider,
      type: 'server',
      database_type: 'mysql',
      webserver_type: 'nginx',
      php_version: '7.4',
    };

    const response = await this.callApi(
      null,
      'post',
      { body: { ...defaults, ...options } },
      Server,
    );
    this.setId(response.getDataId());
    return response;
  }

  async createCustom(
    ip: string,
    options: {
      type?: string;
      ssh_port?: number;
      database_type?: string;
      php_version?: string;
      name?: string;
      os_type?: string;
      description?: string;
      [key: string]: unknown;
    } = {},
  ): Promise<ApiResponse<Server>> {
    this.setId(null);

    const defaults = {
      ip,
      type: 'server',
      ssh_port: 22,
      database_type: 'mysql',
      php_version: '7.4',
    };

    const response = await this.callApi(
      'custom',
      'post',
      { body: { ...defaults, ...options } },
      Server,
    );
    this.setId(response.getDataId());
    return response;
  }

  async startInstallation(
    url?: string | null,
    options: { install_monitoring?: boolean; webhook_url?: string } = {},
  ): Promise<ApiResponse<unknown>> {
    const id = this.getId();

    if (!url && !id) {
      throw new RequiresId(
        'This endpoint requires an ID. Supply an ID or a valid installation url.',
      );
    }

    const endpoint = url ?? `servers/custom/${id}/start`;
    const body =
      options.install_monitoring != null || options.webhook_url != null
        ? options
        : undefined;
    return this.api(endpoint, 'post', body ? { body } : undefined);
  }

  /** @deprecated Prefer `server().opcache().refresh()`. */
  async refreshOpcache(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi('refresh-opcache', 'post');
  }

  /** @deprecated Prefer `server().opcache().enable()`. */
  async enableOpcache(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi('enable-opcache', 'post');
  }

  /** @deprecated Prefer `server().opcache().disable()`. */
  async disableOpcache(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi('disable-opcache', 'delete');
  }

  async phpVersions(id?: number | null): Promise<ApiResponse<string[]>> {
    this.setIdOrFail(id);
    return this.callApi('php/versions');
  }

  async installPhpVersion(version: string): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    return this.callApi('php/install', 'post', { body: { version } });
  }

  async switchPhpCliVersion(version: string): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    return this.callApi('php/cli-version', 'post', { body: { version } });
  }

  async restart(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi('restart', 'post');
  }

  async monitoring(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi('monitor');
  }

  async installWpCli(): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    return this.callApi('install/wp-cli', 'post');
  }

  /** @alias installWpCli — PHP SDK naming */
  async installWordPressCli(): Promise<ApiResponse<unknown>> {
    return this.installWpCli();
  }

  async uninstallWpCli(): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    return this.callApi('uninstall/wp-cli', 'delete');
  }

  /** @alias uninstallWpCli — PHP SDK naming */
  async uninstallWordPressCli(): Promise<ApiResponse<unknown>> {
    return this.uninstallWpCli();
  }

  async runWpCli(command: string): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    return this.callApi('wp-cli/run', 'post', { body: { command } });
  }

  /** @alias runWpCli — PHP SDK naming */
  async runWordPressCli(command: string): Promise<ApiResponse<unknown>> {
    return this.runWpCli(command);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Server[]>> {
    return this.pageModels(listOf(Server), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Server[]>> {
    return this.searchModels(searchQuery, listOf(Server));
  }

  sites(id?: number | null): SiteResource {
    return new SiteResource(this, id);
  }

  services(serviceName?: string | null): ServiceResource {
    return new ServiceResource(this, serviceName);
  }

  databases(id?: number | null): DatabaseResource {
    return new DatabaseResource(this, id);
  }

  cronjobs(id?: number | null): CronjobResource {
    return new CronjobResource(this, id);
  }

  networkRules(id?: number | null): NetworkRuleResource {
    return new NetworkRuleResource(this, id);
  }

  systemUsers(id?: number | null): SystemUserResource {
    return new SystemUserResource(this, id);
  }

  daemons(id?: number | null): DaemonResource {
    return new DaemonResource(this, id);
  }

  sshKeys(id?: number | null): SshKeyResource {
    return new SshKeyResource(this, id);
  }

  opcache(id?: number | null): OpcacheResource {
    return new OpcacheResource(this, id);
  }

  insights(id?: number | null): InsightResource {
    return new InsightResource(this, id);
  }

  loadBalancer(): LoadBalancerResource {
    return new LoadBalancerResource(this);
  }

  docker(id?: number | null): DockerContainerResource {
    return new DockerContainerResource(this, id);
  }

  containers(id?: number | null): DockerContainerResource {
    return this.docker(id);
  }
}
