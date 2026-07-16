import { Model } from './model';

export interface CronjobAttributes {
  id: number;
  command: string;
  user: string;
  frequency: string;
  created_at: string;
  status?: string;
}

export class Cronjob extends Model<CronjobAttributes> {
  get id(): number { return this.attrs.id; }
  get command(): string { return this.attrs.command; }
  get user(): string { return this.attrs.user; }
  get frequency(): string { return this.attrs.frequency; }
  get createdAt(): string { return this.attrs.created_at; }
  get status(): string | undefined { return this.attrs.status; }

  static from(data: unknown): Cronjob {
    return new Cronjob(Model.requireObject<CronjobAttributes>(data));
  }

  static fromMany(data: unknown): Cronjob[] {
    return Model.requireArray(data).map((item) => Cronjob.from(item));
  }
}

