import { ApiResponse, listOf } from '../http/response';
import { SystemUser } from '../models/system-user';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class SystemUserResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/system-users`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<SystemUser[]>>;
  get(id: number): Promise<ApiResponse<SystemUser>>;
  async get(id?: number | null): Promise<ApiResponse<SystemUser | SystemUser[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SystemUser);
  }

  async create(name: string, sudo = false): Promise<ApiResponse<SystemUser>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { name, sudo },
    }, SystemUser);
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
  ): Promise<ApiResponse<SystemUser[]>> {
    return this.pageModels(listOf(SystemUser), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<SystemUser[]>> {
    return this.searchModels(searchQuery, listOf(SystemUser));
  }
}
