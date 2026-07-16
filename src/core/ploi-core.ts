import { Ploi, type PloiOptions } from '../ploi';
import { CoreUserResource } from './resources/core-user';
import { CoreSiteResource } from './resources/core-site';
import { CoreServerResource } from './resources/core-server';
import { CorePackageResource } from './resources/core-package';

export type PloiCoreOptions = Omit<PloiOptions, 'baseUrl'> & {
  /** Panel API base URL, e.g. `https://panel.example.com/api`. */
  baseUrl: string;
};

export class PloiCore {
  private readonly ploi: Ploi;

  constructor(token: string, options: PloiCoreOptions) {
    if (!options.baseUrl?.trim()) {
      throw new Error('baseUrl is required for PloiCore');
    }

    this.ploi = new Ploi(token, options);
  }

  setApiToken(token: string): this {
    this.ploi.setApiToken(token);
    return this;
  }

  getApiToken(): string {
    return this.ploi.getApiToken();
  }

  setBaseUrl(baseUrl: string): this {
    this.ploi.setBaseUrl(baseUrl);
    return this;
  }

  getBaseUrl(): string {
    return this.ploi.getBaseUrl();
  }

  setUserAgent(userAgent: string): this {
    this.ploi.setUserAgent(userAgent);
    return this;
  }

  getUserAgent(): string {
    return this.ploi.getUserAgent();
  }

  users(id?: number | null): CoreUserResource {
    return new CoreUserResource(this.ploi, id);
  }

  sites(id?: number | null): CoreSiteResource {
    return new CoreSiteResource(this.ploi, id);
  }

  servers(): CoreServerResource {
    return new CoreServerResource(this.ploi);
  }

  packages(): CorePackageResource {
    return new CorePackageResource(this.ploi);
  }
}
