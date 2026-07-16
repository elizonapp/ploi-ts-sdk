import type { Ploi } from '../ploi';
import { ApiResponse, listOf, type ModelFactory } from '../http/response';
import { Project } from '../models/project';
import { Resource } from './resource';

export class ProjectResource extends Resource {
  private readonly resourcePath = 'projects';

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
    return this.getPloi()!.makeAPICall(this.buildEndpoint(path), method, options, factory);
  }

  get(): Promise<ApiResponse<Project[]>>;
  get(id: number): Promise<ApiResponse<Project>>;
  async get(id?: number | null): Promise<ApiResponse<Project | Project[]>> {
    if (id != null) {
      this.setId(id);
    }

    return this.getId() === null ? this.page() : this.callApi(null, 'get', {}, Project);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    return this.callApi(null, 'delete');
  }

  async create(
    title: string,
    servers: number[] = [],
    sites: number[] = [],
    options: Record<string, unknown> = {},
  ): Promise<ApiResponse<Project>> {
    this.setId(null);

    const defaults = {
      title,
      servers,
      sites,
    };

    const response = await this.callApi(null, 'post', {
      body: { ...defaults, ...options },
    }, Project);
    this.setId(response.getDataId());

    return response;
  }

  async update(
    title: string,
    servers: number[] = [],
    sites: number[] = [],
  ): Promise<ApiResponse<Project>> {
    this.setIdOrFail();

    return this.callApi(null, 'patch', {
      body: { title, servers, sites },
    }, Project);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Project[]>> {
    return this.pageModels(listOf(Project), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Project[]>> {
    return this.searchModels(searchQuery, listOf(Project));
  }
}
