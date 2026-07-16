import type { Ploi } from '../../ploi';
import { ApiResponse, listOf, type ModelFactory } from '../../http/response';
import { Resource } from '../../resources/resource';
import { CorePackage } from '../models/core-package';

export class CorePackageResource extends Resource {
  private readonly resourcePath = 'packages';

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

  async get(): Promise<ApiResponse<CorePackage[]>> {
    return this.page();
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<CorePackage[]>> {
    return this.pageModels(listOf(CorePackage), pageNumber, amountPerPage);
  }
}
