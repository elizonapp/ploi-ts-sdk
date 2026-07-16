import { Model } from './model';

export interface DatabaseSiteRef {
  id: number;
  root_domain: string;
}

export interface DatabaseAttributes {
  id: number;
  type: string;
  name: string;
  server_id: number;
  status: string;
  created_at: string;
  site?: DatabaseSiteRef;
}

export class Database extends Model<DatabaseAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get type(): string { return this.attrs.type; }
  get serverId(): number { return this.attrs.server_id; }
  get status(): string { return this.attrs.status; }
  get createdAt(): string { return this.attrs.created_at; }
  get site(): DatabaseSiteRef | undefined { return this.attrs.site; }

  static from(data: unknown): Database {
    return new Database(Model.requireObject<DatabaseAttributes>(data));
  }

  static fromMany(data: unknown): Database[] {
    return Model.requireArray(data).map((item) => Database.from(item));
  }
}

