import { ApiResponse, listOf } from '../http/response';
import { Daemon } from '../models/daemon';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class DaemonResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/daemons`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Daemon[]>>;
  get(id: number): Promise<ApiResponse<Daemon>>;
  async get(id?: number | null): Promise<ApiResponse<Daemon | Daemon[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Daemon);
  }

  async create(
    command: string,
    systemUser: string,
    processes: number,
    directory?: string | null,
  ): Promise<ApiResponse<Daemon>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        command,
        system_user: systemUser,
        processes,
        directory,
      },
    }, Daemon);
    this.setId(response.getDataId());

    return response;
  }

  async restart(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    this.setEndpoint(`${this.getEndpoint()}/restart`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post');
  }

  async pause(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    this.setEndpoint(`${this.getEndpoint()}/toggle-pause`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post');
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Daemon[]>> {
    return this.pageModels(listOf(Daemon), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Daemon[]>> {
    return this.searchModels(searchQuery, listOf(Daemon));
  }
}
