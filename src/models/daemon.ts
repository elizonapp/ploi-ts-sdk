import { Model } from './model';

export interface DaemonAttributes {
  id: number;
  command: string;
  processes: number;
  system_user: string;
  directory: string | null;
  status: string;
}

export class Daemon extends Model<DaemonAttributes> {
  get id(): number { return this.attrs.id; }
  get command(): string { return this.attrs.command; }
  get processes(): number { return this.attrs.processes; }
  get systemUser(): string { return this.attrs.system_user; }
  get directory(): string | null { return this.attrs.directory; }
  get status(): string { return this.attrs.status; }

  static from(data: unknown): Daemon {
    return new Daemon(Model.requireObject<DaemonAttributes>(data));
  }

  static fromMany(data: unknown): Daemon[] {
    return Model.requireArray(data).map((item) => Daemon.from(item));
  }
}

