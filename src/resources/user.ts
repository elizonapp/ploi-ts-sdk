import type { Ploi } from '../ploi';
import { ApiResponse } from '../http/response';
import { User } from '../models/user';
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
}
