import { Model } from './model';

export interface SourceControlProviderAttributes {
  id: number;
  provider?: string;
  label?: string;
  name?: string;
  created_at?: string;
  [key: string]: unknown;
}

export class SourceControlProvider extends Model<SourceControlProviderAttributes> {
  get id(): number { return this.attrs.id; }
  get provider(): string | undefined { return this.attrs.provider; }
  get label(): string | undefined { return this.attrs.label; }
  get name(): string | undefined { return this.attrs.name; }
  get createdAt(): string | undefined { return this.attrs.created_at; }

  static from(data: unknown): SourceControlProvider {
    return new SourceControlProvider(Model.requireObject<SourceControlProviderAttributes>(data));
  }

  static fromMany(data: unknown): SourceControlProvider[] {
    return Model.requireArray(data).map((item) => SourceControlProvider.from(item));
  }
}
