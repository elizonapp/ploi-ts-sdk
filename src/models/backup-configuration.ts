import { Model } from './model';

export interface BackupConfigurationAttributes {
  id: number;
  type?: string;
  label?: string;
  provider?: string;
  created_at?: string;
  [key: string]: unknown;
}

export class BackupConfiguration extends Model<BackupConfigurationAttributes> {
  get id(): number { return this.attrs.id; }
  get type(): string | undefined { return this.attrs.type; }
  get label(): string | undefined { return this.attrs.label; }
  get provider(): string | undefined { return this.attrs.provider; }
  get createdAt(): string | undefined { return this.attrs.created_at; }

  static from(data: unknown): BackupConfiguration {
    return new BackupConfiguration(Model.requireObject<BackupConfigurationAttributes>(data));
  }

  static fromMany(data: unknown): BackupConfiguration[] {
    return Model.requireArray(data).map((item) => BackupConfiguration.from(item));
  }
}
