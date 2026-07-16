import { Model } from './model';

export interface FileBackupAttributes {
  id: number;
  status?: string;
  interval?: number;
  server?: number;
  sites?: number[];
  path?: string[] | Record<string, string>;
  created_at?: string;
}

export class FileBackup extends Model<FileBackupAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string | undefined { return this.attrs.status; }

  static from(data: unknown): FileBackup {
    return new FileBackup(Model.requireObject<FileBackupAttributes>(data));
  }

  static fromMany(data: unknown): FileBackup[] {
    return Model.requireArray(data).map((item) => FileBackup.from(item));
  }
}

