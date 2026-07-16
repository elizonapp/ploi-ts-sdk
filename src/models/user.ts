import { Model } from './model';

export interface UserAttributes {
  avatar: string;
  name: string;
  email: string;
  billing_details: unknown | null;
  country: string;
  timezone: string;
  created_at: string;
  plan: string;
  plan_expires_at: string;
}

export class User extends Model<UserAttributes> {
  get avatar(): string { return this.attrs.avatar; }
  get name(): string { return this.attrs.name; }
  get email(): string { return this.attrs.email; }
  get country(): string { return this.attrs.country; }
  get timezone(): string { return this.attrs.timezone; }
  get createdAt(): string { return this.attrs.created_at; }
  get plan(): string { return this.attrs.plan; }
  get planExpiresAt(): string { return this.attrs.plan_expires_at; }

  static from(data: unknown): User {
    return new User(Model.requireObject<UserAttributes>(data));
  }
}

