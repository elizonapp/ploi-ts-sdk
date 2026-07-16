import { Model } from './model';

export interface SiteAliasesAttributes {
  aliases: string[];
  count: number;
  main: string;
}

export class SiteAliases extends Model<SiteAliasesAttributes> {
  get aliases(): string[] { return this.attrs.aliases; }
  get count(): number { return this.attrs.count; }
  get main(): string { return this.attrs.main; }

  static from(data: unknown): SiteAliases {
    return new SiteAliases(Model.requireObject<SiteAliasesAttributes>(data));
  }
}

