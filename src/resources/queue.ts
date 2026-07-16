import { ApiResponse, listOf } from '../http/response';
import { QueueWorker } from '../models/queue-worker';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class QueueResource extends Resource {
  constructor(server: ServerResource, site: SiteResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}/queues`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<QueueWorker[]>>;
  get(id: number): Promise<ApiResponse<QueueWorker>>;
  async get(id?: number | null): Promise<ApiResponse<QueueWorker | QueueWorker[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, QueueWorker);
  }

  async create(
    connection = 'database',
    queue = 'default',
    maximumSeconds = 60,
    sleep = 30,
    processes = 1,
    maximumTries = 1,
    backoff = 0,
  ): Promise<ApiResponse<QueueWorker>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        connection,
        queue,
        maximum_seconds: maximumSeconds,
        sleep,
        processes,
        maximum_tries: maximumTries,
        backoff,
      },
    }, QueueWorker);

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
  ): Promise<ApiResponse<QueueWorker[]>> {
    return this.pageModels(listOf(QueueWorker), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<QueueWorker[]>> {
    return this.searchModels(searchQuery, listOf(QueueWorker));
  }
}
