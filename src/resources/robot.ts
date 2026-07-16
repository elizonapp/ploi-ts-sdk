import { ApiResponse } from '../http/response';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class RobotResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(this.getSite().getEndpoint()!);
    return this;
  }

  async allow(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { disable_robots: false },
    });
  }

  async block(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { disable_robots: true },
    });
  }
}
