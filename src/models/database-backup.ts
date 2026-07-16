import { Model } from './model';

export interface DatabaseBackupAttributes {
  id: number;
  status?: string;
  interval?: number;
  server?: number;
  databases?: number[];
  created_at?: string;
}

export class DatabaseBackup extends Model<DatabaseBackupAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string | undefined { return this.attrs.status; }

  static from(data: unknown): DatabaseBackup {
    return new DatabaseBackup(Model.requireObject<DatabaseBackupAttributes>(data));
  }

  static fromMany(data: unknown): DatabaseBackup[] {
    return Model.requireArray(data).map((item) => DatabaseBackup.from(item));
  }
}

