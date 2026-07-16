import { ApiResponse, listOf } from '../http/response';
import { AuthUser } from '../models/auth-user';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class AuthUserResource extends Resource {
  constructor(server: ServerResource, site: SiteResource, id?: number | null) {
    super(server.getPloi());
    this.setServer(server);
    this.setSite(site);

    if (id) {
      this.setId(id);
    }

    this.buildEndpoint();
  }

  buildEndpoint(): this {
    let endpoint = `${this.getSite().getEndpoint()}/auth-users`;

    if (this.getId()) {
      endpoint += `/${this.getId()}`;
    }

    this.setEndpoint(endpoint);
    return this;
  }

  get(): Promise<ApiResponse<AuthUser[]>>;
  get(id: number): Promise<ApiResponse<AuthUser>>;
  async get(id?: number | null): Promise<ApiResponse<AuthUser | AuthUser[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, AuthUser);
  }

  async create(name: string, password: string, path?: string | null): Promise<ApiResponse<AuthUser>> {
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { name, password, path },
    }, AuthUser);
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
  ): Promise<ApiResponse<AuthUser[]>> {
    return this.pageModels(listOf(AuthUser), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<AuthUser[]>> {
    return this.searchModels(searchQuery, listOf(AuthUser));
  }
}
