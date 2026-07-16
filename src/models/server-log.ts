import { Model } from './model';

export interface ServerLogAttributes {
  id?: number;
  server_id: number;
  description?: string;
  type?: string;
  created_at?: string;
}

export class ServerLog extends Model<ServerLogAttributes> {
  get serverId(): number { return this.attrs.server_id; }
  get description(): string | undefined { return this.attrs.description; }
  get type(): string | undefined { return this.attrs.type; }

  static from(data: unknown): ServerLog {
    return new ServerLog(Model.requireObject<ServerLogAttributes>(data));
  }

  static fromMany(data: unknown): ServerLog[] {
    return Model.requireArray(data).map((item) => ServerLog.from(item));
  }
}

