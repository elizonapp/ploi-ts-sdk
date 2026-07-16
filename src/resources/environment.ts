import { ApiResponse } from '../http/response';
import { SiteEnvironment } from '../models/environment';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class EnvironmentResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}/env`,
    );
    return this;
  }

  async get(): Promise<ApiResponse<SiteEnvironment>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SiteEnvironment);
  }

  async update(content: string): Promise<ApiResponse<SiteEnvironment>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { content },
    }, SiteEnvironment);
  }
}
