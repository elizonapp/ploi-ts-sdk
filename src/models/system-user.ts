import { Model } from './model';

export interface SystemUserAttributes {
  id: number;
  name: string;
  root: string;
  created_at: string;
  sudo?: boolean;
}

export class SystemUser extends Model<SystemUserAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get root(): string { return this.attrs.root; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): SystemUser {
    return new SystemUser(Model.requireObject<SystemUserAttributes>(data));
  }

  static fromMany(data: unknown): SystemUser[] {
    return Model.requireArray(data).map((item) => SystemUser.from(item));
  }
}

