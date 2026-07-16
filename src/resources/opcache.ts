import { ApiResponse } from '../http/response';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class OpcacheResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  async refresh(): Promise<ApiResponse<unknown>> {
    this.setEndpoint(`${this.getEndpoint()}/refresh-opcache`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post');
  }

  async enable(): Promise<ApiResponse<unknown>> {
    this.setEndpoint(`${this.getEndpoint()}/enable-opcache`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post');
  }

  async disable(): Promise<ApiResponse<unknown>> {
    this.setEndpoint(`${this.getEndpoint()}/disable-opcache`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post');
  }
}
