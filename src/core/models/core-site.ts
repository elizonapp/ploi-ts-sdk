import { Model } from '../../models/model';

export interface CoreSiteAttributes {
  id: number;
  status: string;
  server_id: number;
  domain: string;
  user_id: number | string;
  created_at: string;
}

export class CoreSite extends Model<CoreSiteAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string { return this.attrs.status; }
  get serverId(): number { return this.attrs.server_id; }
  get domain(): string { return this.attrs.domain; }
  get userId(): number | string { return this.attrs.user_id; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): CoreSite {
    return new CoreSite(Model.requireObject<CoreSiteAttributes>(data));
  }

  static fromMany(data: unknown): CoreSite[] {
    return Model.requireArray(data).map((item) => CoreSite.from(item));
  }
}
