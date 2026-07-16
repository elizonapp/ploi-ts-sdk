import { ApiResponse } from '../http/response';
import { DeployResult, DeployScript } from '../models/deployment';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class DeploymentResource extends Resource {
  constructor(server: ServerResource, site: SiteResource) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}`,
    );
    return this;
  }

  async deploy(): Promise<ApiResponse<DeployResult>> {
    this.setEndpoint(`${this.getEndpoint()}/deploy`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {}, DeployResult);
  }

  async deployToProduction(): Promise<ApiResponse<DeployResult>> {
    this.setEndpoint(`${this.getEndpoint()}/deploy-to-production`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {}, DeployResult);
  }

  async deployScript(): Promise<ApiResponse<DeployScript>> {
    this.setEndpoint(`${this.getEndpoint()}/deploy/script`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, DeployScript);
  }

  async updateDeployScript(script = ''): Promise<ApiResponse<DeployScript>> {
    this.setEndpoint(`${this.getEndpoint()}/deploy/script`);
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { deploy_script: script },
    }, DeployScript);
  }
}
