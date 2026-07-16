import { Model } from './model';

export interface WebserverTemplateAttributes {
  id: number;
  label?: string;
  name?: string;
  content?: string;
}

export class WebserverTemplate extends Model<WebserverTemplateAttributes> {
  get id(): number { return this.attrs.id; }
  get label(): string | undefined { return this.attrs.label ?? this.attrs.name; }

  static from(data: unknown): WebserverTemplate {
    return new WebserverTemplate(Model.requireObject<WebserverTemplateAttributes>(data));
  }

  static fromMany(data: unknown): WebserverTemplate[] {
    return Model.requireArray(data).map((item) => WebserverTemplate.from(item));
  }
}

