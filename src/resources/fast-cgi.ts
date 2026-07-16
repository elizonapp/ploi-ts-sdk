import { ApiResponse } from '../http/response';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class FastCgiResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getSite().getEndpoint()}/fastcgi-cache`);
    return this;
  }

  async enable(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/enable`, 'post');
  }

  async disable(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/disable`, 'delete');
  }

  async flush(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/flush`, 'post');
  }
}
