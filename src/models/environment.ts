import { Model } from './model';

export interface SiteEnvironmentAttributes {
  content: string;
}

export class SiteEnvironment extends Model<SiteEnvironmentAttributes> {
  get content(): string { return this.attrs.content; }

  static from(data: unknown): SiteEnvironment {
    if (typeof data === 'string') {
      return new SiteEnvironment({ content: data });
    }
    if (data && typeof data === 'object' && 'content' in data) {
      return new SiteEnvironment(Model.requireObject<SiteEnvironmentAttributes>(data));
    }
    // Some endpoints return the raw env body as the whole JSON string value
    return new SiteEnvironment({ content: String(data ?? '') });
  }
}

