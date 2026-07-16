import { Model } from './model';

export interface SiteTenantsAttributes {
  tenants: string[];
  count: number;
  main: string;
}

export class SiteTenants extends Model<SiteTenantsAttributes> {
  get tenants(): string[] { return this.attrs.tenants; }
  get count(): number { return this.attrs.count; }
  get main(): string { return this.attrs.main; }

  static from(data: unknown): SiteTenants {
    return new SiteTenants(Model.requireObject<SiteTenantsAttributes>(data));
  }
}

