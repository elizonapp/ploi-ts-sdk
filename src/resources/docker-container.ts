import { ApiResponse, listOf } from '../http/response';
import { DockerContainer } from '../models/docker-container';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class DockerContainerResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    let path = `${this.getServer().getEndpoint()}/${this.getServer().getId()}/docker/containers`;
    if (this.getId()) {
      path += `/${this.getId()}`;
    }
    this.setEndpoint(path);
    return this;
  }

  get(): Promise<ApiResponse<DockerContainer[]>>;
  get(id: number): Promise<ApiResponse<DockerContainer>>;
  async get(id?: number | null): Promise<ApiResponse<DockerContainer | DockerContainer[]>> {
    if (id != null) {
      this.setId(id);
    }
    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, DockerContainer);
  }

  async create(name: string, deployScript?: string | null): Promise<ApiResponse<DockerContainer>> {
    this.setId(null);
    this.buildEndpoint();

    const body: Record<string, unknown> = { name };
    if (deployScript != null) {
      body.deploy_script = deployScript;
    }

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body,
    }, DockerContainer);
    this.setId(response.getDataId());
    return response;
  }

  async update(
    name?: string | null,
    deployScript?: string | null,
  ): Promise<ApiResponse<DockerContainer>> {
    this.setIdOrFail();
    this.buildEndpoint();

    const body: Record<string, unknown> = {};
    if (name != null) body.name = name;
    if (deployScript != null) body.deploy_script = deployScript;

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', { body }, DockerContainer);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async up(flags?: string[] | null): Promise<ApiResponse<unknown>> {
    return this.start(flags);
  }

  async start(flags?: string[] | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();
    const options = flags != null ? { body: { flags } } : {};
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/up`, 'post', options);
  }

  async down(flags?: string[] | null): Promise<ApiResponse<unknown>> {
    return this.stop(flags);
  }

  async stop(flags?: string[] | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();
    const options = flags != null ? { body: { flags } } : {};
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/down`, 'post', options);
  }

  async logs(lines = 50): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/logs?lines=${lines}`);
  }

  async linkSite(siteId: number, port: number | string, host: string): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/site/link`, 'post', {
      body: { site_id: siteId, port, host },
    });
  }

  async unlinkSite(): Promise<ApiResponse<unknown>> {
    this.setIdOrFail();
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/site/unlink`, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<DockerContainer[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.pageModels(listOf(DockerContainer), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<DockerContainer[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.searchModels(searchQuery, listOf(DockerContainer));
  }
}
