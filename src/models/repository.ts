import { Model } from './model';

export interface RepositoryInfo {
  branch: string;
  user: string;
  provider: string;
  name?: string;
}

export interface SiteRepositoryAttributes {
  id: number;
  domain: string;
  web_directory: string;
  wordpress?: boolean;
  laravel?: boolean;
  project_root: string;
  last_deploy_at: string | null;
  created_at: string;
  repository: RepositoryInfo;
  quick_deploy?: boolean;
}

export class SiteRepository extends Model<SiteRepositoryAttributes> {
  get id(): number { return this.attrs.id; }
  get domain(): string { return this.attrs.domain; }
  get repository(): RepositoryInfo { return this.attrs.repository; }
  get quickDeploy(): boolean | undefined { return this.attrs.quick_deploy; }
  get lastDeployAt(): string | null { return this.attrs.last_deploy_at; }

  static from(data: unknown): SiteRepository {
    return new SiteRepository(Model.requireObject<SiteRepositoryAttributes>(data));
  }
}

