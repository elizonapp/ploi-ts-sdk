import { ApiResponse } from '../http/response';
import { NginxConfiguration } from '../models/nginx-configuration';
import { Resource } from './resource';
import type { SiteResource } from './site';

export class NginxConfigurationResource extends Resource {
  constructor(site: SiteResource) {
    super(site.getPloi());
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getSite().getEndpoint()}/nginx-configuration`);
    return this;
  }

  async get(): Promise<ApiResponse<NginxConfiguration>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, NginxConfiguration);
  }

  async update(configuration: string): Promise<ApiResponse<NginxConfiguration>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { content: configuration },
    }, NginxConfiguration);
  }
}
