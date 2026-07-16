import { ApiResponse } from '../http/response';
import { RequiresServiceName } from '../exceptions/resource/requires-service-name';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class ServiceResource extends Resource {
  private serviceName: string | null = null;

  constructor(server: ServerResource, serviceName?: string | null) {
    super(server.getPloi());
    this.setServer(server);

    if (serviceName) {
      this.setServiceName(serviceName);
    }

    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/services`,
    );

    if (this.getServiceName()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getServiceName()}`);
    }

    return this;
  }

  getServiceName(): string | null {
    return this.serviceName;
  }

  setServiceName(serviceName: string): this {
    this.serviceName = serviceName;
    this.addHistory(`Resource service name set to ${serviceName}`);
    return this;
  }

  async restart(serviceName?: string | null): Promise<ApiResponse<unknown>> {
    if (serviceName) {
      this.setServiceName(serviceName);
    }

    if (!this.getServiceName()) {
      throw new RequiresServiceName();
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/restart`, 'post');
  }
}
