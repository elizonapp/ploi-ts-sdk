import type { PaginationLinks, PaginationMeta } from '../models/common';

export type ApiJson = {
  data?: unknown;
  id?: unknown;
  message?: string;
  links?: PaginationLinks;
  meta?: PaginationMeta;
  [key: string]: unknown;
};

export type ModelFactory<T> = {
  from(data: unknown): T;
  fromMany?(data: unknown): T[];
};

function readNumericId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

/**
 * Typed HTTP response wrapper. Prefer {@link getData} / {@link getModels} over raw JSON.
 */
export class ApiResponse<T = unknown> {
  private json: ApiJson | null = null;
  private readonly response: globalThis.Response;
  private readonly bodyText: string;
  private readonly factory?: ModelFactory<T>;

  constructor(
    response: globalThis.Response,
    bodyText: string,
    factory?: ModelFactory<T>,
  ) {
    this.response = response;
    this.bodyText = bodyText;
    this.factory = factory;
    this.decodeJson();
  }

  private decodeJson(): this {
    if (!this.bodyText) {
      return this.setJson(null);
    }

    try {
      return this.setJson(JSON.parse(this.bodyText) as ApiJson);
    } catch {
      return this.setJson(null);
    }
  }

  setJson(json: ApiJson | null = null): this {
    this.json = json;
    return this;
  }

  /** Full decoded JSON body. */
  getJson(): ApiJson | null {
    return this.json;
  }

  /**
   * Raw `data` payload (or full JSON when `data` is absent).
   * Prefer {@link getData} when a model factory is attached.
   */
  getRawData(): unknown {
    if (this.json && Object.prototype.hasOwnProperty.call(this.json, 'data')) {
      return this.json.data;
    }
    return this.json;
  }

  /**
   * Typed model instance(s) when a factory was provided; otherwise cast of raw data.
   * List responses (`data: T[]`) are mapped via `fromMany` when available.
   */
  getData(): T {
    const raw = this.getRawData();
    if (this.factory) {
      if (Array.isArray(raw) && this.factory.fromMany) {
        return this.factory.fromMany(raw) as T;
      }
      return this.factory.from(raw);
    }
    return raw as T;
  }

  /**
   * Parse `data` as a list of models. Requires `fromMany` on the factory.
   */
  getModels(): T extends unknown[] ? T : T[] {
    const raw = this.getRawData();
    if (this.factory?.fromMany) {
      return this.factory.fromMany(raw) as T extends unknown[] ? T : T[];
    }
    if (this.factory) {
      return ModelList(raw, this.factory) as T extends unknown[] ? T : T[];
    }
    return (Array.isArray(raw) ? raw : [raw]) as T extends unknown[] ? T : T[];
  }

  getMessage(): string | undefined {
    return this.json?.message;
  }

  getLinks(): PaginationLinks | undefined {
    return this.json?.links;
  }

  getMeta(): PaginationMeta | undefined {
    return this.json?.meta;
  }

  /** ID from `data.id`, falling back to top-level `id`. */
  getDataId(): number | null {
    const data = this.getRawData();
    if (data && typeof data === 'object' && data !== null && 'id' in data) {
      const fromData = readNumericId((data as { id: unknown }).id);
      if (fromData != null) {
        return fromData;
      }
    }
    return readNumericId(this.json?.id);
  }

  getResponse(): globalThis.Response {
    return this.response;
  }

  getStatus(): number {
    return this.response.status;
  }

  getBody(): string {
    return this.bodyText;
  }

  /** Re-wrap with a different model factory (same HTTP body). */
  as<U>(factory: ModelFactory<U>): ApiResponse<U> {
    return new ApiResponse<U>(this.response, this.bodyText, factory);
  }

  toArray(): { json: ApiJson | null; response: globalThis.Response } {
    return {
      json: this.getJson(),
      response: this.getResponse(),
    };
  }
}

function ModelList<T>(raw: unknown, factory: ModelFactory<T>): T[] {
  if (!Array.isArray(raw)) {
    throw new TypeError('Expected a JSON array in response data');
  }
  return raw.map((item) => factory.from(item));
}

/** Build a factory that maps paginated/list `data` arrays to model instances. */
export function listOf<T>(
  model: ModelFactory<T> & { fromMany(data: unknown): T[] },
): ModelFactory<T[]> {
  return {
    from: (data: unknown) => model.fromMany(data),
    fromMany: (data: unknown) => model.fromMany(data),
  } as ModelFactory<T[]>;
}

/** @deprecated Use ApiResponse — kept for PHP SDK naming parity. */
export { ApiResponse as Response };
