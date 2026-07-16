import type { Ploi } from '../../ploi';
import { ApiResponse, type ModelFactory } from '../../http/response';
import { Resource } from '../../resources/resource';
import { CoreServer, type CoreDatabaseType } from '../models/core-server';

export type CoreServerCreateInput = {
  name: string;
  provider_id: number;
  provider_region_id: number;
  provider_plan_id: number | string;
  database_type: CoreDatabaseType;
  user_id: number;
};

export class CoreServerResource extends Resource {
  private readonly resourcePath = 'servers';

  constructor(ploi?: Ploi | null) {
    super(ploi);
    this.setEndpoint(this.resourcePath);
  }

  buildEndpoint(path?: string | null): string {
    let base = this.resourcePath;

    if (!path) {
      return base;
    }

    if (path.startsWith('/')) {
      return base + path;
    }

    return `${base}/${path}`;
  }

  async callApi<T = unknown>(
    path?: string | null,
    method: 'get' | 'post' | 'patch' | 'delete' = 'get',
    options?: { body?: string | object },
    factory?: ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    return this.getPloi()!.makeAPICall(
      this.buildEndpoint(path),
      method,
      options,
      factory,
    );
  }

  async create(input: CoreServerCreateInput): Promise<ApiResponse<CoreServer>> {
    return this.callApi(null, 'post', { body: input }, CoreServer);
  }
}
