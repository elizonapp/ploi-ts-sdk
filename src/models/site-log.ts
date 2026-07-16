import { Model } from './model';

export interface SiteLogAttributes {
  id: number;
  description?: string;
  content?: string;
  type?: string | null;
  created_at?: string;
  created_at_human?: string;
}

export class SiteLog extends Model<SiteLogAttributes> {
  get id(): number { return this.attrs.id; }
  get description(): string | undefined { return this.attrs.description; }
  get content(): string | undefined { return this.attrs.content; }
  get type(): string | null | undefined { return this.attrs.type; }
  get createdAt(): string | undefined { return this.attrs.created_at; }
  get createdAtHuman(): string | undefined { return this.attrs.created_at_human; }

  static from(data: unknown): SiteLog {
    return new SiteLog(Model.requireObject<SiteLogAttributes>(data));
  }

  static fromMany(data: unknown): SiteLog[] {
    return Model.requireArray(data).map((item) => SiteLog.from(item));
  }
}
