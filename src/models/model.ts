export abstract class Model<T extends object> {
  protected readonly attrs: T;

  protected constructor(attrs: T) {
    this.attrs = Object.freeze({ ...attrs }) as T;
  }

  /** Raw API attributes (snake_case), frozen. */
  toJSON(): T {
    return this.attrs;
  }

  /** Alias for toJSON(). */
  getAttributes(): T {
    return this.attrs;
  }

  static requireObject<T extends object>(data: unknown): T {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new TypeError('Expected a JSON object for model attributes');
    }
    return data as T;
  }

  static requireArray(data: unknown): unknown[] {
    if (!Array.isArray(data)) {
      throw new TypeError('Expected a JSON array for model list');
    }
    return data;
  }
}
