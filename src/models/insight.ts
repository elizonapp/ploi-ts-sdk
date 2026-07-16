import { Model } from './model';

export interface InsightAttributes {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  severity?: string;
  created_at?: string;
}

export class Insight extends Model<InsightAttributes> {
  get id(): number { return this.attrs.id; }
  get title(): string | undefined { return this.attrs.title; }
  get description(): string | undefined { return this.attrs.description; }
  get status(): string | undefined { return this.attrs.status; }

  static from(data: unknown): Insight {
    return new Insight(Model.requireObject<InsightAttributes>(data));
  }

  static fromMany(data: unknown): Insight[] {
    return Model.requireArray(data).map((item) => Insight.from(item));
  }
}

