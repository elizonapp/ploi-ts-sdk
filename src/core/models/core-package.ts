import { Model } from '../../models/model';

export interface CorePackagePermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CorePackageAttributes {
  id: number;
  name: string;
  maximum_servers: number;
  maximum_sites: number;
  price_hourly: number;
  price_monthly: number;
  price_yearly: number;
  stripe_plan_id: string | null;
  currency: string;
  server_permissions: CorePackagePermissions;
  site_permissions: CorePackagePermissions;
  created_at: string;
}

export class CorePackage extends Model<CorePackageAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get maximumServers(): number { return this.attrs.maximum_servers; }
  get maximumSites(): number { return this.attrs.maximum_sites; }
  get priceHourly(): number { return this.attrs.price_hourly; }
  get priceMonthly(): number { return this.attrs.price_monthly; }
  get priceYearly(): number { return this.attrs.price_yearly; }
  get stripePlanId(): string | null { return this.attrs.stripe_plan_id; }
  get currency(): string { return this.attrs.currency; }
  get serverPermissions(): CorePackagePermissions {
    return this.attrs.server_permissions;
  }
  get sitePermissions(): CorePackagePermissions {
    return this.attrs.site_permissions;
  }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): CorePackage {
    return new CorePackage(Model.requireObject<CorePackageAttributes>(data));
  }

  static fromMany(data: unknown): CorePackage[] {
    return Model.requireArray(data).map((item) => CorePackage.from(item));
  }
}
