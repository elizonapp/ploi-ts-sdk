import { ApiResponse, listOf } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';
import { Site } from '../models/site';
import { Resource } from './resource';
import type { ServerResource } from './server';
import { RedirectResource } from './redirect';
import { CertificateResource } from './certificate';
import { RepositoryResource } from './repository';
import { QueueResource } from './queue';
import { DeploymentResource } from './deployment';
import { AppResource } from './app';
import { EnvironmentResource } from './environment';
import { AliasResource } from './alias';
import { FastCgiResource } from './fast-cgi';
import { AuthUserResource } from './auth-user';
import { RobotResource } from './robot';
import { TenantResource } from './tenant';
import { MonitorsResource } from './monitors';
import { NginxConfigurationResource } from './nginx-configuration';

export class SiteResource extends Resource {

  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Site[]>>;
  get(id: number): Promise<ApiResponse<Site>>;
  async get(id?: number | null): Promise<ApiResponse<Site | Site[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Site);
  }

  async create(
    domain: string,
    webDirectory = '/public',
    projectRoot?: string | null,
    systemUser?: string | null,
    webserverTemplate?: number | null,
    projectType?: string | null,
    webhookUrl?: string | null,
  ): Promise<ApiResponse<Site>> {
    this.setId(null);

    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        root_domain: domain,
        web_directory: webDirectory,
        project_root: projectRoot,
        system_user: systemUser,
        webserver_template: webserverTemplate,
        project_type: projectType,
        webhook_url: webhookUrl,
      },
    }, Site);
    this.setId(response.getDataId());

    return response;
  }

  async update(rootDomain: string): Promise<ApiResponse<Site>> {
    this.setIdOrFail();
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { root_domain: rootDomain },
    }, Site);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async logs(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    if (!this.getId()) {
      throw new RequiresId('No Site ID set');
    }

    this.setEndpoint(`${this.buildEndpoint().getEndpoint()}/log`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!);
  }

  async phpVersion(version: string | number = '7.4'): Promise<ApiResponse<Site>> {
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/php-version`,
      'post',
      { body: { php_version: version } },
      Site,
    );
    this.setId(response.getDataId());

    return response;
  }

  async testDomain(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    if (!this.getId()) {
      throw new RequiresId('No Site ID set');
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/test-domain`, 'get');
  }

  async enableTestDomain(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    if (!this.getId()) {
      throw new RequiresId('No Site ID set');
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/test-domain`, 'post');
  }

  async disableTestDomain(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    if (!this.getId()) {
      throw new RequiresId('No Site ID set');
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/test-domain`, 'delete');
  }

  async suspend(id?: number | null, reason?: string | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);

    const options: { body?: object } = {};
    if (reason) {
      options.body = { reason };
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/suspend`, 'post', options);
  }

  async resume(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/resume`, 'post');
  }

  async horizonStatistics(type = 'stats'): Promise<ApiResponse<unknown>> {
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/laravel/horizon/${type}`,
    );
  }

  async clone(cloneToServer: number, domain?: string | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/clone`, 'post', {
      body: {
        clone_to_server: cloneToServer,
        domain,
      },
    });
  }

  async resetPermissions(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/permission-reset`, 'post');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Site[]>> {
    return this.pageModels(listOf(Site), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Site[]>> {
    return this.searchModels(searchQuery, listOf(Site));
  }

  redirects(id?: number | null): RedirectResource {
    return new RedirectResource(this.getServer<ServerResource>(), this, id);
  }

  certificates(id?: number | null): CertificateResource {
    return new CertificateResource(this.getServer<ServerResource>(), this, id);
  }

  repository(): RepositoryResource {
    return new RepositoryResource(this.getServer<ServerResource>(), this);
  }

  queues(id?: number | null): QueueResource {
    return new QueueResource(this.getServer<ServerResource>(), this, id);
  }

  deployment(): DeploymentResource {
    return new DeploymentResource(this.getServer<ServerResource>(), this);
  }

  app(id?: number | null): AppResource {
    return new AppResource(this.getServer<ServerResource>(), this, id);
  }

  environment(): EnvironmentResource {
    return new EnvironmentResource(this.getServer<ServerResource>(), this);
  }

  alias(): AliasResource {
    return new AliasResource(this.getServer<ServerResource>(), this);
  }

  fastCgi(): FastCgiResource {
    return new FastCgiResource(this.getServer<ServerResource>(), this);
  }

  authUser(id?: number | null): AuthUserResource {
    return new AuthUserResource(this.getServer<ServerResource>(), this, id);
  }

  robots(): RobotResource {
    return new RobotResource(this.getServer<ServerResource>(), this);
  }

  tenants(): TenantResource {
    return new TenantResource(this);
  }

  monitors(id?: number | null): MonitorsResource {
    return new MonitorsResource(this, id);
  }

  nginxConfiguration(): NginxConfigurationResource {
    return new NginxConfigurationResource(this);
  }
}
