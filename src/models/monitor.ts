import { Model } from './model';

export interface MonitorAttributes {
  id: number;
  type?: string;
  status?: string;
  url?: string;
  created_at?: string;
}

export class Monitor extends Model<MonitorAttributes> {
  get id(): number { return this.attrs.id; }
  get type(): string | undefined { return this.attrs.type; }
  get status(): string | undefined { return this.attrs.status; }
  get url(): string | undefined { return this.attrs.url; }

  static from(data: unknown): Monitor {
    return new Monitor(Model.requireObject<MonitorAttributes>(data));
  }

  static fromMany(data: unknown): Monitor[] {
    return Model.requireArray(data).map((item) => Monitor.from(item));
  }
}

