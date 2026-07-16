import { Model } from './model';

export interface CertificateAttributes {
  id: number;
  status: string;
  domain: string;
  site_id: number;
  server_id: number;
  expires_at: string;
  created_at: string;
  type?: string;
}

export class Certificate extends Model<CertificateAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string { return this.attrs.status; }
  get domain(): string { return this.attrs.domain; }
  get siteId(): number { return this.attrs.site_id; }
  get serverId(): number { return this.attrs.server_id; }
  get expiresAt(): string { return this.attrs.expires_at; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): Certificate {
    return new Certificate(Model.requireObject<CertificateAttributes>(data));
  }

  static fromMany(data: unknown): Certificate[] {
    return Model.requireArray(data).map((item) => Certificate.from(item));
  }
}

