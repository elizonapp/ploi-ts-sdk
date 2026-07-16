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

  async attach(serverId: number): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/attach`, 'patch', {
      body: { server_id: serverId },
    });
  }

  async detach(serverId: number): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/detach`, 'patch', {
      body: { server_id: serverId },
    });
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
