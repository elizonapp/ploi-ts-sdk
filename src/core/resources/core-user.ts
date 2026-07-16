import type { Ploi } from '../../ploi';
import { ApiResponse, listOf, type ModelFactory } from '../../http/response';
import { Resource } from '../../resources/resource';
import { CoreUser } from '../models/core-user';

export class CoreUserResource extends Resource {
  private readonly resourcePath = 'users';

  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.setEndpoint(this.resourcePath);
  }

  buildEndpoint(path?: string | null): string {
    let base = this.resourcePath;

    if (this.getId()) {
      base = `${base}/${this.getId()}`;
    }

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

  get(): Promise<ApiResponse<CoreUser[]>>;
  get(id: number): Promise<ApiResponse<CoreUser>>;
  async get(id?: number | null): Promise<ApiResponse<CoreUser | CoreUser[]>> {
    if (id != null) {
      this.setId(id);
    }

    return this.getId() === null
      ? this.page()
      : this.callApi(null, 'get', {}, CoreUser);
  }

  async create(
    name: string,
    email: string,
    options: {
      package_id?: number | null;
      blocked?: string | null;
    } = {},
  ): Promise<ApiResponse<CoreUser>> {
    this.setId(null);

    const response = await this.callApi(
      null,
      'post',
      { body: { name, email, ...options } },
      CoreUser,
    );
    this.setId(response.getDataId());
    return response;
  }

  async update(
    options: {
      name?: string;
      email?: string;
      package_id?: number | null;
      blocked?: string | null;
    } = {},
  ): Promise<ApiResponse<CoreUser>> {
    this.setIdOrFail();
    return this.callApi(null, 'patch', { body: options }, CoreUser);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi(null, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<CoreUser[]>> {
    return this.pageModels(listOf(CoreUser), pageNumber, amountPerPage);
  }
}
