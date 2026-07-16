import { ApiResponse, listOf } from '../http/response';
import { Monitor } from '../models/monitor';
import { Resource } from './resource';
import type { SiteResource } from './site';

export class MonitorsResource extends Resource {
  constructor(site: SiteResource, id?: number | null) {
    super(site.getPloi());
    this.setSite(site);

    if (id) {
      this.setId(id);
    }

    this.buildEndpoint();
  }

  buildEndpoint(): this {
    let endpoint = `${this.getSite().getEndpoint()}/monitors`;

    if (this.getId()) {
      endpoint += `/${this.getId()}`;
    }

    this.setEndpoint(endpoint);
    return this;
  }

  get(): Promise<ApiResponse<Monitor[]>>;
  get(id: number): Promise<ApiResponse<Monitor>>;
  async get(id?: number | null): Promise<ApiResponse<Monitor | Monitor[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Monitor);
  }

  async uptimeResponses(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/uptime-responses`);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Monitor[]>> {
    return this.pageModels(listOf(Monitor), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Monitor[]>> {
    return this.searchModels(searchQuery, listOf(Monitor));
  }
}
