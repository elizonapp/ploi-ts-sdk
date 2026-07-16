import { Model } from './model';

export interface SshKeyAttributes {
  id: number;
  status: string;
  name: string;
  key: string;
  system_user: string;
}

export class SshKey extends Model<SshKeyAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string { return this.attrs.status; }
  get name(): string { return this.attrs.name; }
  get key(): string { return this.attrs.key; }
  get systemUser(): string { return this.attrs.system_user; }

  static from(data: unknown): SshKey {
    return new SshKey(Model.requireObject<SshKeyAttributes>(data));
  }

  static fromMany(data: unknown): SshKey[] {
    return Model.requireArray(data).map((item) => SshKey.from(item));
  }
}

