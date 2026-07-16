import { ApiResponse, listOf } from '../http/response';
import { Insight } from '../models/insight';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class InsightResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    let endpoint = `${this.getServer().getEndpoint()}/${this.getServer().getId()}/insights`;

    if (this.getId()) {
      endpoint += `/${this.getId()}`;
    }

    this.setEndpoint(endpoint);
    return this;
  }

  get(): Promise<ApiResponse<Insight[]>>;
  get(id: number): Promise<ApiResponse<Insight>>;
  async get(id?: number | null): Promise<ApiResponse<Insight | Insight[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Insight);
  }

  async detail(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/detail`);
  }

  async automaticallyFix(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/automatically-fix`, 'post');
  }

  async ignore(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/ignore`, 'post');
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Insight[]>> {
    return this.pageModels(listOf(Insight), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Insight[]>> {
    return this.searchModels(searchQuery, listOf(Insight));
  }
}
