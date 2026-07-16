import { ApiResponse, listOf } from '../http/response';
import { SshKey } from '../models/ssh-key';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class SshKeyResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/ssh-keys`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<SshKey[]>>;
  get(id: number): Promise<ApiResponse<SshKey>>;
  async get(id?: number | null): Promise<ApiResponse<SshKey | SshKey[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SshKey);
  }

  async create(name: string, key: string, systemUser?: string | null): Promise<ApiResponse<SshKey>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { name, key, system_user: systemUser },
    }, SshKey);
    this.setId(response.getDataId());

    return response;
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<SshKey[]>> {
    return this.pageModels(listOf(SshKey), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<SshKey[]>> {
    return this.searchModels(searchQuery, listOf(SshKey));
  }
}
