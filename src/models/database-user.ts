import { Model } from './model';

export interface DatabaseUserAttributes {
  id: number;
  user: string;
  remote: boolean;
  remote_ip: string;
  readonly: boolean;
  created_at: string;
}

export class DatabaseUser extends Model<DatabaseUserAttributes> {
  get id(): number { return this.attrs.id; }
  get user(): string { return this.attrs.user; }
  get remote(): boolean { return this.attrs.remote; }
  get remoteIp(): string { return this.attrs.remote_ip; }
  get readonly(): boolean { return this.attrs.readonly; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): DatabaseUser {
    return new DatabaseUser(Model.requireObject<DatabaseUserAttributes>(data));
  }

  static fromMany(data: unknown): DatabaseUser[] {
    return Model.requireArray(data).map((item) => DatabaseUser.from(item));
  }
}

