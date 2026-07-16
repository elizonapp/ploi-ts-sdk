import { ApiResponse, listOf } from '../http/response';
import { Redirect } from '../models/redirect';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class RedirectResource extends Resource {
  constructor(server: ServerResource, site: SiteResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}/redirects`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Redirect[]>>;
  get(id: number): Promise<ApiResponse<Redirect>>;
  async get(id?: number | null): Promise<ApiResponse<Redirect | Redirect[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Redirect);
  }

  async create(
    redirectFrom: string,
    redirectTo: string,
    type: string | number = 'redirect',
  ): Promise<ApiResponse<Redirect>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        redirect_from: redirectFrom,
        redirect_to: redirectTo,
        type,
      },
    }, Redirect);
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
  ): Promise<ApiResponse<Redirect[]>> {
    return this.pageModels(listOf(Redirect), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Redirect[]>> {
    return this.searchModels(searchQuery, listOf(Redirect));
  }
}
