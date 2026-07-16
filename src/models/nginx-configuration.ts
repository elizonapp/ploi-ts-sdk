import { Model } from './model';

export interface NginxConfigurationAttributes {
  content: string;
}

export class NginxConfiguration extends Model<NginxConfigurationAttributes> {
  get content(): string { return this.attrs.content; }

  static from(data: unknown): NginxConfiguration {
    if (typeof data === 'string') {
      return new NginxConfiguration({ content: data });
    }
    return new NginxConfiguration(Model.requireObject<NginxConfigurationAttributes>(data));
  }
}

