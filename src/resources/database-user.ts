import { ApiResponse, listOf } from '../http/response';
import { DatabaseUser } from '../models/database-user';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { DatabaseResource } from './database';

export class DatabaseUserResource extends Resource {
  constructor(server: ServerResource, database: DatabaseResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setDatabase(database);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getDatabase().getEndpoint()}/users`);

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<DatabaseUser[]>>;
  get(id: number): Promise<ApiResponse<DatabaseUser>>;
  async get(id?: number | null): Promise<ApiResponse<DatabaseUser | DatabaseUser[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, DatabaseUser);
  }

  async create(
    user: string,
    password: string,
    remote = false,
    remoteIp = '%',
    readOnly = false,
  ): Promise<ApiResponse<DatabaseUser>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        user,
        password,
        remote,
        remote_ip: remoteIp,
        readonly: readOnly,
      },
    }, DatabaseUser);
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
  ): Promise<ApiResponse<DatabaseUser[]>> {
    return this.pageModels(listOf(DatabaseUser), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<DatabaseUser[]>> {
    return this.searchModels(searchQuery, listOf(DatabaseUser));
  }
}
