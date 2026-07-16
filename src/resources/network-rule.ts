import { ApiResponse, listOf } from '../http/response';
import { NetworkRule } from '../models/network-rule';
import { Resource } from './resource';
import type { ServerResource } from './server';

export class NetworkRuleResource extends Resource {
  constructor(server: ServerResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/network-rules`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<NetworkRule[]>>;
  get(id: number): Promise<ApiResponse<NetworkRule>>;
  async get(id?: number | null): Promise<ApiResponse<NetworkRule | NetworkRule[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, NetworkRule);
  }

  async create(
    name: string,
    port: number,
    type = 'tcp',
    fromIpAddress?: string | null,
    ruleType = 'allow',
  ): Promise<ApiResponse<NetworkRule>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: {
        name,
        port,
        type,
        rule_type: ruleType,
        from_ip_address: fromIpAddress,
      },
    }, NetworkRule);
    this.setId(response.getDataId());

    return response;
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<NetworkRule[]>> {
    return this.pageModels(listOf(NetworkRule), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<NetworkRule[]>> {
    return this.searchModels(searchQuery, listOf(NetworkRule));
  }
}
