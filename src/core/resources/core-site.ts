import type { Ploi } from '../../ploi';
import { ApiResponse, listOf, type ModelFactory } from '../../http/response';
import { Resource } from '../../resources/resource';
import { CoreSite } from '../models/core-site';

export type CoreSiteCreateInput = {
  server_id: number;
  domain: string;
  user_id: number;
};

export class CoreSiteResource extends Resource {
  private readonly resourcePath = 'sites';

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

  get(): Promise<ApiResponse<CoreSite[]>>;
  get(id: number): Promise<ApiResponse<CoreSite>>;
  async get(id?: number | null): Promise<ApiResponse<CoreSite | CoreSite[]>> {
    if (id != null) {
      this.setId(id);
    }

    return this.getId() === null
      ? this.page()
      : this.callApi(null, 'get', {}, CoreSite);
  }

  async create(input: CoreSiteCreateInput): Promise<ApiResponse<CoreSite>> {
    this.setId(null);

    const response = await this.callApi(null, 'post', { body: input }, CoreSite);
    this.setId(response.getDataId());
    return response;
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<CoreSite[]>> {
    return this.pageModels(listOf(CoreSite), pageNumber, amountPerPage);
  }
}
