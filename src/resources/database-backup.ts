import { ApiResponse, listOf } from '../http/response';
import { DatabaseBackup } from '../models/database-backup';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { DatabaseResource } from './database';

export class DatabaseBackupResource extends Resource {
  constructor(server: ServerResource, database: DatabaseResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.setDatabase(database);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint('backups/database');

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<DatabaseBackup[]>>;
  get(id: number): Promise<ApiResponse<DatabaseBackup>>;
  async get(id?: number | null): Promise<ApiResponse<DatabaseBackup | DatabaseBackup[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, DatabaseBackup);
  }

  async create(
    interval: number,
    backup_configuration: number,
    databases?: number[] | null,
    table_exclusions?: string | null,
    locations?: string | null,
    path?: string | null,
    keep_backup_amount?: number | null,
    custom_name?: string | null,
    password?: string | null,
    deleteOnFail?: boolean | null,
  ): Promise<ApiResponse<DatabaseBackup>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        backup_configuration,
        server: this.getServer().getId(),
        databases: databases ?? [this.getDatabase().getId()],
        interval,
        table_exclusions,
        locations,
        path,
        keep_backup_amount,
        custom_name,
        password,
        deleteOnFail,
      },
    }, DatabaseBackup);
    this.setId(response.getDataId());

    return response;
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async toggle(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/toggle`, 'patch');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<DatabaseBackup[]>> {
    return this.pageModels(listOf(DatabaseBackup), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<DatabaseBackup[]>> {
    return this.searchModels(searchQuery, listOf(DatabaseBackup));
  }
}
