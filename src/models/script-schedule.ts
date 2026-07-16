import { Model } from './model';

export interface ScriptScheduleAttributes {
  id: number;
  cron_expression: string;
  servers?: number[];
  active?: boolean;
  created_at?: string;
}

export class ScriptSchedule extends Model<ScriptScheduleAttributes> {
  get id(): number { return this.attrs.id; }
  get cronExpression(): string { return this.attrs.cron_expression; }
  get servers(): number[] | undefined { return this.attrs.servers; }
  get active(): boolean | undefined { return this.attrs.active; }
  get createdAt(): string | undefined { return this.attrs.created_at; }

  static from(data: unknown): ScriptSchedule {
    return new ScriptSchedule(Model.requireObject<ScriptScheduleAttributes>(data));
  }

  static fromMany(data: unknown): ScriptSchedule[] {
    return Model.requireArray(data).map((item) => ScriptSchedule.from(item));
  }
}
