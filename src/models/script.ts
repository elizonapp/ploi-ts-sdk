import { Model } from './model';

export interface ScriptAttributes {
  id: number;
  user: string;
  label: string;
  content: string;
  created_at: string;
}

export class Script extends Model<ScriptAttributes> {
  get id(): number { return this.attrs.id; }
  get user(): string { return this.attrs.user; }
  get label(): string { return this.attrs.label; }
  get content(): string { return this.attrs.content; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): Script {
    return new Script(Model.requireObject<ScriptAttributes>(data));
  }

  static fromMany(data: unknown): Script[] {
    return Model.requireArray(data).map((item) => Script.from(item));
  }
}

