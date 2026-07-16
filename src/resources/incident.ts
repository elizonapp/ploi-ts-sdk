import { ApiResponse, listOf } from '../http/response';
import { Incident } from '../models/incident';
import { Resource } from './resource';
import type { StatusPageResource } from './status-page';

export class IncidentResource extends Resource {
  private statusPage: StatusPageResource;

  constructor(statusPage: StatusPageResource, id?: number | null) {
    super(statusPage.getPloi(), id);
    this.statusPage = statusPage;
    this.buildEndpoint();
  }

  setStatusPage(statusPage: StatusPageResource): this {
    this.statusPage = statusPage;
    return this;
  }

  getStatusPage(): StatusPageResource {
    return this.statusPage;
  }

  buildEndpoint(): this {
    let endpoint = `${this.getStatusPage().getEndpoint()}/incidents`;

    if (this.getId()) {
      endpoint += `/${this.getId()}`;
    }

    this.setEndpoint(endpoint);
    return this;
  }

  get(): Promise<ApiResponse<Incident[]>>;
  get(id: number): Promise<ApiResponse<Incident>>;
  async get(id?: number | null): Promise<ApiResponse<Incident | Incident[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Incident);
  }

  async create(
    title: string,
    description?: string | null,
    severity?: string | null,
  ): Promise<ApiResponse<Incident>> {
    this.buildEndpoint();

    const body: Record<string, unknown> = { title };
    if (description != null) body.description = description;
    if (severity != null) body.severity = severity;

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body,
    }, Incident);
    this.setId(response.getDataId());

    return response;
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    // Docs use singular `/incident/{id}` for delete (list/create use `/incidents`)
    const url = `${this.getStatusPage().getEndpoint()}/incident/${this.getId()}`;
    return this.getPloi()!.makeAPICall(url, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Incident[]>> {
    return this.pageModels(listOf(Incident), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Incident[]>> {
    return this.searchModels(searchQuery, listOf(Incident));
  }
}
