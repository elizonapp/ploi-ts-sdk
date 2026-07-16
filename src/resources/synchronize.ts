import type { Ploi } from '../ploi';
import { ApiResponse } from '../http/response';
import { Resource } from './resource';

export class SynchronizeResource extends Resource {
  private readonly resourcePath = 'synchronize';

  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.setEndpoint(this.resourcePath);
  }

  async servers(): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/servers`);
  }
}
