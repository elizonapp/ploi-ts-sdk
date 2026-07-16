import { ApiResponse, listOf } from '../http/response';
import { Cronjob } from '../models/crontab';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class CronjobResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/crontabs`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Cronjob[]>>;
  get(id: number): Promise<ApiResponse<Cronjob>>;
  async get(id?: number | null): Promise<ApiResponse<Cronjob | Cronjob[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Cronjob);
  }

  async create(command: string, frequency: string, user = 'ploi'): Promise<ApiResponse<Cronjob>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { command, frequency, user },
    }, Cronjob);
    this.setId(response.getDataId());

    return response;
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Cronjob[]>> {
    return this.pageModels(listOf(Cronjob), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Cronjob[]>> {
    return this.searchModels(searchQuery, listOf(Cronjob));
  }
}
