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

  private baseEndpoint(): string {
    return `${this.getServer().getEndpoint()}/${this.getServer().getId()}`;
  }

  async refresh(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.baseEndpoint()}/refresh-opcache`, 'post');
  }

  async enable(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.baseEndpoint()}/enable-opcache`, 'post');
  }

  async disable(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.baseEndpoint()}/disable-opcache`, 'delete');
  }
}
