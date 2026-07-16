import { ApiResponse } from '../http/response';
import { SiteAliases } from '../models/alias';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class AliasResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getSite().getEndpoint()}/aliases`);
    return this;
  }

  async get(): Promise<ApiResponse<SiteAliases>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SiteAliases);
  }

  async create(aliases: string[]): Promise<ApiResponse<SiteAliases>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { aliases },
    }, SiteAliases);
  }

  async delete(alias: string): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/${alias}`, 'delete');
  }
}
