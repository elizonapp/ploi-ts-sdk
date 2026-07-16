import { Model } from './model';

export interface IncidentAttributes {
  id: number;
  title: string;
  description: string;
  severity: string;
  created_at?: string;
  status?: string;
}

export class Incident extends Model<IncidentAttributes> {
  get id(): number { return this.attrs.id; }
  get title(): string { return this.attrs.title; }
  get description(): string { return this.attrs.description; }
  get severity(): string { return this.attrs.severity; }

  static from(data: unknown): Incident {
    return new Incident(Model.requireObject<IncidentAttributes>(data));
  }

  static fromMany(data: unknown): Incident[] {
    return Model.requireArray(data).map((item) => Incident.from(item));
  }
}

