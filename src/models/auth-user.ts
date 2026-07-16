import { Model } from './model';

export interface AuthUserAttributes {
  id: number;
  name: string;
  path?: string | null;
  created_at?: string;
}

export class AuthUser extends Model<AuthUserAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get path(): string | null | undefined { return this.attrs.path; }

  static from(data: unknown): AuthUser {
    return new AuthUser(Model.requireObject<AuthUserAttributes>(data));
  }

  static fromMany(data: unknown): AuthUser[] {
    return Model.requireArray(data).map((item) => AuthUser.from(item));
  }
}

