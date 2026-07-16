import { Model } from '../../models/model';

export interface CoreUserAttributes {
  id: number;
  avatar: string;
  name: string;
  email: string;
  package_id: number | null;
  blocked: string | null;
  created_at: string;
}

export class CoreUser extends Model<CoreUserAttributes> {
  get id(): number { return this.attrs.id; }
  get avatar(): string { return this.attrs.avatar; }
  get name(): string { return this.attrs.name; }
  get email(): string { return this.attrs.email; }
  get packageId(): number | null { return this.attrs.package_id; }
  get blocked(): string | null { return this.attrs.blocked; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): CoreUser {
    return new CoreUser(Model.requireObject<CoreUserAttributes>(data));
  }

  static fromMany(data: unknown): CoreUser[] {
    return Model.requireArray(data).map((item) => CoreUser.from(item));
  }
}
