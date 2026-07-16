import { Model } from './model';

export interface StatusPageThemeBorders {
  header: boolean;
}

export interface StatusPageTheme {
  primary: string;
  secondary: string;
  borders: StatusPageThemeBorders;
  lightMode: string;
  logo: string | null;
  branding: boolean;
}

export interface StatusPageAttributes {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  theme: StatusPageTheme;
}

export class StatusPage extends Model<StatusPageAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get slug(): string { return this.attrs.slug; }
  get description(): string | null { return this.attrs.description; }
  get theme(): StatusPageTheme { return this.attrs.theme; }

  static from(data: unknown): StatusPage {
    return new StatusPage(Model.requireObject<StatusPageAttributes>(data));
  }

  static fromMany(data: unknown): StatusPage[] {
    return Model.requireArray(data).map((item) => StatusPage.from(item));
  }
}

