import { Model } from '../../models/model';

export type CoreDatabaseType =
  | 'mysql'
  | 'mariadb'
  | 'postgresql'
  | 'postgresql13';

export interface CoreServerAttributes {
  id: number;
  status: string;
  name: string;
  provider_id: number;
  provider_region_id: number;
  provider_plan_id: number | string;
  database_type: CoreDatabaseType;
  user_id: number | string;
  created_at: string;
}

export class CoreServer extends Model<CoreServerAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string { return this.attrs.status; }
  get name(): string { return this.attrs.name; }
  get providerId(): number { return this.attrs.provider_id; }
  get providerRegionId(): number { return this.attrs.provider_region_id; }
  get providerPlanId(): number | string { return this.attrs.provider_plan_id; }
  get databaseType(): CoreDatabaseType { return this.attrs.database_type; }
  get userId(): number | string { return this.attrs.user_id; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): CoreServer {
    return new CoreServer(Model.requireObject<CoreServerAttributes>(data));
  }
}
