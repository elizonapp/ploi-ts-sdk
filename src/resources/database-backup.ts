import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { DatabaseBackup } from '../models/database-backup';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { DatabaseResource } from './database';

export class DatabaseBackupResource extends Resource {
  constructor(server: ServerResource, database: DatabaseResource, id?: number | null);
  constructor(ploi: Ploi, id?: number | null);
  constructor(
    serverOrPloi: ServerResource | Ploi,
    databaseOrId?: DatabaseResource | number | null,
    id?: number | null,
  ) {
    if (typeof (serverOrPloi as ServerResource).getPloi === 'function'
      && databaseOrId
      && typeof (databaseOrId as DatabaseResource).getEndpoint === 'function') {
      const server = serverOrPloi as ServerResource;
      const database = databaseOrId as DatabaseResource;
      super(server.getPloi(), id);
      this.setServer(server);
      this.setDatabase(database);
    } else {
      super(serverOrPloi as Ploi, databaseOrId as number | null | undefined);
    }
    this.buildEndpoint();
  }

  static root(ploi: Ploi, id?: number | null): DatabaseBackupResource {
    return new DatabaseBackupResource(ploi, id);
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
    serverId?: number | null,
    next_backup_at?: string | null,
  ): Promise<ApiResponse<DatabaseBackup>> {
    this.setId(null);
    this.buildEndpoint();

    const server = this.getServer()?.getId() ?? serverId;
    const dbIds = databases ?? (this.getDatabase()?.getId() != null
      ? [this.getDatabase()!.getId()!]
      : undefined);

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        backup_configuration,
        server,
        databases: dbIds,
        interval,
        table_exclusions,
        locations,
        path,
        keep_backup_amount,
        custom_name,
        password,
        deleteOnFail,
        next_backup_at,
      },
    }, DatabaseBackup);
    this.setId(response.getDataId());

    return response;
  }

  async update(fields: {
    interval?: number;
    keep_backup_amount?: number;
    excluded?: string[];
    table_exclusions?: string;
    locations?: string;
    path?: string;
    next_backup_at?: string;
    custom_name?: string;
    password?: string;
    deleteOnFail?: boolean;
    compression?: boolean | string;
  }): Promise<ApiResponse<DatabaseBackup>> {
    this.setIdOrFail();
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: fields,
    }, DatabaseBackup);
  }

  async run(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/run`, 'post');
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
