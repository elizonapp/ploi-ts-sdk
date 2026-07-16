import { Model } from './model';

export interface ServerProvider {
  id: number;
  name: string;
}

export interface ServerUpdates {
  packages: number;
  security: number;
}

export interface ServerAttributes {
  id: number;
  status: string;
  type: string;
  name: string;
  ip_address: string;
  php_version: number | string;
  mysql_version: string | number;
  sites_count: number;
  created_at: string;
  status_id?: number;
  monitoring?: boolean;
  database_type?: string;
  internal_ip?: string | null;
  ssh_port?: number;
  reboot_required?: boolean;
  php_cli_version?: string;
  opcache?: boolean;
  installed_php_versions?: string[];
  updates?: ServerUpdates;
  description?: string | null;
  provider?: ServerProvider;
  created_human?: string;
  uptime_human?: string | null;
  ssh_command?: string;
  start_installation_url?: string;
}

export class Server extends Model<ServerAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get status(): string { return this.attrs.status; }
  get type(): string { return this.attrs.type; }
  get ipAddress(): string { return this.attrs.ip_address; }
  get phpVersion(): number | string { return this.attrs.php_version; }
  get mysqlVersion(): string | number { return this.attrs.mysql_version; }
  get sitesCount(): number { return this.attrs.sites_count; }
  get createdAt(): string { return this.attrs.created_at; }
  get monitoring(): boolean | undefined { return this.attrs.monitoring; }
  get sshCommand(): string | undefined { return this.attrs.ssh_command; }
  get startInstallationUrl(): string | undefined { return this.attrs.start_installation_url; }

  static from(data: unknown): Server {
    return new Server(Model.requireObject<ServerAttributes>(data));
  }

  static fromMany(data: unknown): Server[] {
    return Model.requireArray(data).map((item) => Server.from(item));
  }
}

