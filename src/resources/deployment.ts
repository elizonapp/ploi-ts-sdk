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

  async deploy(options: {
    scheduled?: string;
    variables?: Record<string, string | number | boolean>;
  } = {}): Promise<ApiResponse<DeployResult>> {
    const body: Record<string, unknown> = {};
    if (options.scheduled != null) body.scheduled = options.scheduled;
    if (options.variables != null) body.variables = options.variables;

    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/deploy`,
      'post',
      Object.keys(body).length ? { body } : {},
      DeployResult,
    );
  }

  async deployToProduction(): Promise<ApiResponse<DeployResult>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/deploy-to-production`,
      'post',
      {},
      DeployResult,
    );
  }

  async deployScript(): Promise<ApiResponse<DeployScript>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/deploy/script`,
      'get',
      {},
      DeployScript,
    );
  }

  async updateDeployScript(script = ''): Promise<ApiResponse<DeployScript>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/deploy/script`,
      'patch',
      { body: { deploy_script: script } },
      DeployScript,
    );
  }
}
