import { ApiResponse } from '../http/response';
import { SiteRepository } from '../models/repository';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class RepositoryResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}/repository`,
    );
    return this;
  }

  async get(): Promise<ApiResponse<SiteRepository>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SiteRepository);
  }

  async install(
    provider: string,
    branch: string,
    name: string,
    options: {
      source_provider_id?: number;
      install_composer?: boolean;
    } = {},
  ): Promise<ApiResponse<SiteRepository>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { provider, branch, name, ...options },
    }, SiteRepository);
  }

  async delete(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async toggleQuickDeploy(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/quick-deploy`, 'post');
  }

  async customDeployments(script?: string | null): Promise<ApiResponse<unknown>> {
    const options = script != null ? { body: { script } } : {};
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/custom-deployments`,
      'post',
      options,
    );
  }
}
