import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { StatusPage } from '../models/status-page';
import { Resource } from './resource';
import { IncidentResource } from './incident';

export class StatusPageResource extends Resource {
  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    let endpoint = 'status-pages';

    if (this.getId()) {
      endpoint += `/${this.getId()}`;
    }

    this.setEndpoint(endpoint);
    return this;
  }

  get(): Promise<ApiResponse<StatusPage[]>>;
  get(id: number): Promise<ApiResponse<StatusPage>>;
  async get(id?: number | null): Promise<ApiResponse<StatusPage | StatusPage[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, StatusPage);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<StatusPage[]>> {
    return this.pageModels(listOf(StatusPage), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<StatusPage[]>> {
    return this.searchModels(searchQuery, listOf(StatusPage));
  }

  incident(id?: number | null): IncidentResource {
    return new IncidentResource(this, id);
  }
}
