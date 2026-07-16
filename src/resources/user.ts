import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { User } from '../models/user';
import { SourceControlProvider } from '../models/source-control';
import { BackupConfiguration } from '../models/backup-configuration';
import { Resource } from './resource';

export class UserResource extends Resource {
  private readonly resourcePath = 'user';

  constructor(ploi?: Ploi | null) {
    super(ploi);
    this.setEndpoint(this.resourcePath);
  }

  async get(): Promise<ApiResponse<User>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, User);
  }

  async statistics(): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/statistics`;
    return this.getPloi()!.makeAPICall(url);
  }

  async serverProviders(providerId?: number | null): Promise<ApiResponse<unknown>> {
    let url = `${this.getEndpoint()}/server-providers`;

    if (providerId) {
      url += `/${providerId}`;
    }

    return this.getPloi()!.makeAPICall(url);
  }

  async sourceControl(id?: number | null): Promise<ApiResponse<SourceControlProvider | SourceControlProvider[]>> {
    let url = `${this.getEndpoint()}/source-control`;

    if (id != null) {
      url += `/${id}`;
      return this.getPloi()!.makeAPICall(url, 'get', {}, SourceControlProvider);
    }

    return this.getPloi()!.makeAPICall(url, 'get', {}, listOf(SourceControlProvider));
  }

  async sourceControlRepositories(id: number): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/source-control/${id}/repositories`,
    );
  }

  async backupConfigurations(
    id?: number | null,
  ): Promise<ApiResponse<BackupConfiguration | BackupConfiguration[]>> {
    let url = `${this.getEndpoint()}/backup-configurations`;

    if (id != null) {
      url += `/${id}`;
      return this.getPloi()!.makeAPICall(url, 'get', {}, BackupConfiguration);
    }

    return this.getPloi()!.makeAPICall(url, 'get', {}, listOf(BackupConfiguration));
  }
}
