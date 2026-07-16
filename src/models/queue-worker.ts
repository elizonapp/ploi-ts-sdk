import { Model } from './model';

export interface QueueWorkerAttributes {
  id: number;
  connection: string;
  queue: string;
  maximum_seconds: number;
  maximum_tries: number | null;
  enviroment: string | null;
  sleep: number;
  processes: number;
  backoff?: number;
  status: string;
  site_id: number;
  server_id: number;
}

export class QueueWorker extends Model<QueueWorkerAttributes> {
  get id(): number { return this.attrs.id; }
  get connection(): string { return this.attrs.connection; }
  get queue(): string { return this.attrs.queue; }
  get maximumSeconds(): number { return this.attrs.maximum_seconds; }
  get maximumTries(): number | null { return this.attrs.maximum_tries; }
  get sleep(): number { return this.attrs.sleep; }
  get processes(): number { return this.attrs.processes; }
  get status(): string { return this.attrs.status; }
  get siteId(): number { return this.attrs.site_id; }
  get serverId(): number { return this.attrs.server_id; }

  static from(data: unknown): QueueWorker {
    return new QueueWorker(Model.requireObject<QueueWorkerAttributes>(data));
  }

  static fromMany(data: unknown): QueueWorker[] {
    return Model.requireArray(data).map((item) => QueueWorker.from(item));
  }
}

