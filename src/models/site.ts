import { Model } from './model';

export interface SiteNotificationUrls {
  slack: string | null;
  discord: string | null;
  webhook: string | null;
}

export interface SiteDiskUsage {
  bytes: number;
  human: string;
}

export interface SiteAttributes {
  id: number;
  server_id: number;
  status?: string;
  domain: string;
  deploy_script: boolean | string;
  web_directory: string;
  project_type: string | null;
  project_root: string;
  last_deploy_at: string | null;
  system_user: string | null;
  php_version: number | string;
  health_url: string | null;
  has_repository: boolean;
  created_at: string;
  notification_urls?: SiteNotificationUrls;
  quick_deploy?: boolean;
  disk_usage?: SiteDiskUsage;
  test_domain?: string | null;
  disable_robots?: boolean;
  zero_downtime_deployment?: boolean;
  has_staging?: boolean;
  fastcgi_cache?: boolean;
}

export class Site extends Model<SiteAttributes> {
  get id(): number { return this.attrs.id; }
  get serverId(): number { return this.attrs.server_id; }
  get domain(): string { return this.attrs.domain; }
  get status(): string | undefined { return this.attrs.status; }
  get webDirectory(): string { return this.attrs.web_directory; }
  get projectType(): string | null { return this.attrs.project_type; }
  get projectRoot(): string { return this.attrs.project_root; }
  get phpVersion(): number | string { return this.attrs.php_version; }
  get systemUser(): string | null { return this.attrs.system_user; }
  get hasRepository(): boolean { return this.attrs.has_repository; }
  get createdAt(): string { return this.attrs.created_at; }
  get lastDeployAt(): string | null { return this.attrs.last_deploy_at; }
  get testDomain(): string | null | undefined { return this.attrs.test_domain; }

  static from(data: unknown): Site {
    return new Site(Model.requireObject<SiteAttributes>(data));
  }

  static fromMany(data: unknown): Site[] {
    return Model.requireArray(data).map((item) => Site.from(item));
  }
}

