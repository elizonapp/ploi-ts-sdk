import { Model } from './model';

export interface ScriptActionAttributes {
  id: number;
  trigger: string;
  servers?: number[];
  delay_seconds?: number;
  active?: boolean;
  secret?: string;
  created_at?: string;
}

export class ScriptAction extends Model<ScriptActionAttributes> {
  get id(): number { return this.attrs.id; }
  get trigger(): string { return this.attrs.trigger; }
  get servers(): number[] | undefined { return this.attrs.servers; }
  get delaySeconds(): number | undefined { return this.attrs.delay_seconds; }
  get active(): boolean | undefined { return this.attrs.active; }
  get secret(): string | undefined { return this.attrs.secret; }
  get createdAt(): string | undefined { return this.attrs.created_at; }

  static from(data: unknown): ScriptAction {
    return new ScriptAction(Model.requireObject<ScriptActionAttributes>(data));
  }

  static fromMany(data: unknown): ScriptAction[] {
    return Model.requireArray(data).map((item) => ScriptAction.from(item));
  }
}
