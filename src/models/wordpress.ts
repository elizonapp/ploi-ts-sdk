import { Model } from './model';

export interface WordpressPluginAttributes {
  name: string;
  status?: string;
  update?: string;
  version?: string;
  [key: string]: unknown;
}

export class WordpressPlugin extends Model<WordpressPluginAttributes> {
  get name(): string { return this.attrs.name; }
  get status(): string | undefined { return this.attrs.status; }
  get update(): string | undefined { return this.attrs.update; }
  get version(): string | undefined { return this.attrs.version; }

  static from(data: unknown): WordpressPlugin {
    return new WordpressPlugin(Model.requireObject<WordpressPluginAttributes>(data));
  }

  static fromMany(data: unknown): WordpressPlugin[] {
    return Model.requireArray(data).map((item) => WordpressPlugin.from(item));
  }
}

export interface WordpressThemeAttributes {
  name: string;
  status?: string;
  update?: string;
  version?: string;
  [key: string]: unknown;
}

export class WordpressTheme extends Model<WordpressThemeAttributes> {
  get name(): string { return this.attrs.name; }
  get status(): string | undefined { return this.attrs.status; }
  get update(): string | undefined { return this.attrs.update; }
  get version(): string | undefined { return this.attrs.version; }

  static from(data: unknown): WordpressTheme {
    return new WordpressTheme(Model.requireObject<WordpressThemeAttributes>(data));
  }

  static fromMany(data: unknown): WordpressTheme[] {
    return Model.requireArray(data).map((item) => WordpressTheme.from(item));
  }
}

export interface WordpressRepositoryAttributes {
  id: number;
  provider?: string;
  name?: string;
  branch?: string;
  target_directory?: string;
  [key: string]: unknown;
}

export class WordpressRepository extends Model<WordpressRepositoryAttributes> {
  get id(): number { return this.attrs.id; }
  get provider(): string | undefined { return this.attrs.provider; }
  get name(): string | undefined { return this.attrs.name; }
  get branch(): string | undefined { return this.attrs.branch; }
  get targetDirectory(): string | undefined { return this.attrs.target_directory; }

  static from(data: unknown): WordpressRepository {
    return new WordpressRepository(Model.requireObject<WordpressRepositoryAttributes>(data));
  }

  static fromMany(data: unknown): WordpressRepository[] {
    return Model.requireArray(data).map((item) => WordpressRepository.from(item));
  }
}
