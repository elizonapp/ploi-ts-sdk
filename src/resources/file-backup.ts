import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { FileBackup } from '../models/file-backup';
import { Resource } from './resource';

export class FileBackupResource extends Resource {
  constructor(ploi: Ploi, id?: number | null) {
    super(ploi, id);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint('backups/file');

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    if (this.getAction()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getAction()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<FileBackup[]>>;
  get(id: number): Promise<ApiResponse<FileBackup>>;
  async get(id?: number | null): Promise<ApiResponse<FileBackup | FileBackup[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, FileBackup);
  }

  async create(
    backup_configuration: number,
    server: number,
    sites: number[],
    interval: number,
    path: Record<string, string> | string[],
    locations?: string | null,
    keep_backup_amount?: number | null,
    custom_name?: string | null,
    password?: string | null,
    deleteOnFail?: boolean | null,
  ): Promise<ApiResponse<FileBackup>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        backup_configuration,
        server,
        sites,
        interval,
        path,
        locations,
        keep_backup_amount,
        custom_name,
        password,
        deleteOnFail,
      },
    }, FileBackup);
    this.setId(response.getDataId());

    return response;
  }

  async run(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.setAction('run');
    this.buildEndpoint();

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
  ): Promise<ApiResponse<FileBackup[]>> {
    return this.pageModels(listOf(FileBackup), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<FileBackup[]>> {
    return this.searchModels(searchQuery, listOf(FileBackup));
  }
}
