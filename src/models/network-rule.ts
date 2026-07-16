import { Model } from './model';

export interface NetworkRuleAttributes {
  id: number;
  name: string;
  port: number;
  from_ip_address: string | null;
  rule_type: string;
  status: string;
  created_at: string;
  type?: string;
}

export class NetworkRule extends Model<NetworkRuleAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get port(): number { return this.attrs.port; }
  get fromIpAddress(): string | null { return this.attrs.from_ip_address; }
  get ruleType(): string { return this.attrs.rule_type; }
  get status(): string { return this.attrs.status; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): NetworkRule {
    return new NetworkRule(Model.requireObject<NetworkRuleAttributes>(data));
  }

  static fromMany(data: unknown): NetworkRule[] {
    return Model.requireArray(data).map((item) => NetworkRule.from(item));
  }
}

