import { ApiResponse } from '../http/response';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class LoadBalancerResource extends Resource {
  constructor(server: ServerResource) {
    super(server.getPloi());
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getServer<ServerResource>().buildEndpoint('load-balancer')}`);
    return this;
  }

  async requestCertificate(domain: string): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${domain}/request-certificate`;
    return this.getPloi()!.makeAPICall(url, 'post');
  }

  async revokeCertificate(domain: string): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${domain}/revoke-certificate`;
    return this.getPloi()!.makeAPICall(url, 'delete');
  }
}
