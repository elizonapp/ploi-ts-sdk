import { ApiResponse, listOf } from '../http/response';
import { Database } from '../models/database';
import { Resource } from './resource';
import type { ServerResource } from './server';
import { DatabaseBackupResource } from './database-backup';
import { DatabaseUserResource } from './database-user';

export class DatabaseResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/databases`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    if (this.getAction()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getAction()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Database[]>>;
  get(id: number): Promise<ApiResponse<Database>>;
  async get(id?: number | null): Promise<ApiResponse<Database | Database[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Database);
  }

  async create(
    name: string,
    user: string,
    password: string,
    description?: string | null,
    siteId?: number | null,
  ): Promise<ApiResponse<Database>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        name,
        user,
        password,
        description,
        site_id: siteId,
      },
    }, Database);
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

  async acknowledge(name: string): Promise<ApiResponse<unknown>> {
    this.setId(null);
    this.setAction('acknowledge');
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { name },
    });
  }

  async forget(id?: number | null): Promise<ApiResponse<unknown>> {
    if (id) {
      this.setId(id);
    }

    this.setAction('forget');
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async duplicate(
    name: string,
    user?: string | null,
    password?: string | null,
  ): Promise<ApiResponse<Database>> {
    this.setIdOrFail();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/duplicate`, 'post', {
      body: { name, user, password },
    }, Database);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Database[]>> {
    return this.pageModels(listOf(Database), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Database[]>> {
    return this.searchModels(searchQuery, listOf(Database));
  }

  backups(id?: number | null): DatabaseBackupResource {
    return new DatabaseBackupResource(this.getServer<ServerResource>(), this, id);
  }

  users(id?: number | null): DatabaseUserResource {
    return new DatabaseUserResource(this.getServer<ServerResource>(), this, id);
  }
}
