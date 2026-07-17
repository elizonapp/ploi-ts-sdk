import type { Ploi } from '../ploi';
import { ApiResponse, type ModelFactory } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';

export abstract class Resource {
  private ploi: Ploi | null = null;
  private action: string | null = null;
  private endpoint: string | null = null;
  private id: number | null = null;
  // Parent references — typed loosely to avoid circular import issues at runtime
  private database: Resource | null = null;
  private server: Resource | null = null;
  private site: Resource | null = null;
  private history: string[] = [];
  protected searchQuery: string | null = null;
  protected amountPerPage: number | null = null;

  constructor(ploi?: Ploi | null, id?: number | null) {
    if (ploi) {
      this.setPloi(ploi);
    }

    if (id != null) {
      this.setId(id);
    }
  }

  setId(id?: number | null): this {
    this.id = id ?? null;
    this.addHistory(`Resource ID set to ${id ?? null}`);
    return this;
  }

  setIdOrFail(id?: number | null): this {
    if (id != null) {
      this.setId(id);
    }

    if (this.getId() == null) {
      throw new RequiresId(`ID is required for ${this.constructor.name}`);
    }

    return this;
  }

  getId(): number | null {
    return this.id;
  }

  setPloi(ploi: Ploi): this {
    this.ploi = ploi;
    this.addHistory('Ploi instance set');
    return this;
  }

  getPloi(): Ploi | null {
    return this.ploi;
  }

  setEndpoint(endpoint: string): this {
    this.endpoint = endpoint;
    return this;
  }

  getEndpoint(): string | null {
    return this.endpoint;
  }

  getSite<T extends Resource = Resource>(): T {
    return this.site as T;
  }

  setSite(site: Resource): this {
    this.site = site;
    return this;
  }

  getDatabase<T extends Resource = Resource>(): T {
    return this.database as T;
  }

  setDatabase(database: Resource): this {
    this.database = database;
    return this;
  }

  getServer<T extends Resource = Resource>(): T {
    return this.server as T;
  }

  setServer(server: Resource): this {
    this.server = server;
    return this;
  }

  setAction(action: string): this {
    this.action = action;
    return this;
  }

  getAction(): string | null {
    return this.action;
  }

  getHistory(): string[] {
    return this.history;
  }

  setHistory(history: string[]): this {
    this.history = history;
    return this;
  }

  addHistory(entry: string): this {
    this.history.push(entry);
    return this;
  }

  setSearchQuery(searchQuery?: string | null): this {
    this.searchQuery = searchQuery ?? null;
    return this;
  }

  async search(
    searchQuery: string,
    factory?: ModelFactory<unknown>,
  ): Promise<ApiResponse<unknown>> {
    return this.fetchSearch(searchQuery, factory);
  }

  perPage(amountPerPage?: number | null): this {
    this.amountPerPage = amountPerPage ?? null;
    return this;
  }

  async page(
    pageNumber = 1,
    amountPerPage?: number | null,
    factory?: ModelFactory<unknown>,
  ): Promise<ApiResponse<unknown>> {
    return this.fetchPage(pageNumber, amountPerPage, factory);
  }

  protected getPaginationQuery(
    pageNumber: number,
    amountPerPage?: number | null,
  ): string {
    let path = `?page=${pageNumber}`;

    if (amountPerPage != null) {
      this.perPage(amountPerPage);
    }

    if (this.amountPerPage != null) {
      path += `&per_page=${this.amountPerPage}`;
    }

    return path;
  }

  protected async api<T = unknown>(
    url: string,
    method: 'get' | 'post' | 'patch' | 'delete' = 'get',
    options?: { body?: string | object },
    factory?: ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    return this.getPloi()!.makeAPICall(url, method, options, factory);
  }

  /** HTTP for page/pageModels — not overridable via page() (avoids recursion). */
  protected fetchPage(
    pageNumber = 1,
    amountPerPage?: number | null,
    factory?: ModelFactory<unknown>,
  ): Promise<ApiResponse<unknown>> {
    const ploi = this.getPloi();
    const endpoint = this.getEndpoint();

    if (!ploi || !endpoint) {
      throw new Error('Ploi instance or endpoint is not set.');
    }

    return ploi.makeAPICall(
      `${endpoint}${this.getPaginationQuery(pageNumber, amountPerPage)}`,
      'get',
      {},
      factory,
    );
  }

  /** HTTP for search/searchModels — same recursion constraint as fetchPage. */
  protected fetchSearch(
    searchQuery: string,
    factory?: ModelFactory<unknown>,
  ): Promise<ApiResponse<unknown>> {
    const ploi = this.getPloi();
    const endpoint = this.getEndpoint();

    if (!ploi || !endpoint) {
      throw new Error('Ploi instance or endpoint is not set.');
    }

    return ploi.makeAPICall(
      `${endpoint}?search=${encodeURIComponent(searchQuery)}`,
      'get',
      {},
      factory,
    );
  }

  protected pageModels<T>(
    factory: ModelFactory<T>,
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<T>> {
    return this.fetchPage(pageNumber, amountPerPage, factory) as Promise<
      ApiResponse<T>
    >;
  }

  protected searchModels<T>(
    searchQuery: string,
    factory: ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    return this.fetchSearch(searchQuery, factory) as Promise<ApiResponse<T>>;
  }
}
