import { ApiResponse, listOf } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';
import { ScriptSchedule } from '../models/script-schedule';
import { Resource } from './resource';
import type { ScriptResource } from './script';

export class ScriptScheduleResource extends Resource {
  private readonly script: ScriptResource;

  constructor(script: ScriptResource, id?: number | null) {
    super(script.getPloi(), id);
    this.script = script;
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    const scriptId = this.script.getId();
    if (scriptId == null) {
      throw new RequiresId('Script ID is required for schedules');
    }

    let path = `scripts/${scriptId}/schedules`;
    if (this.getId()) {
      path += `/${this.getId()}`;
    }
    this.setEndpoint(path);
    return this;
  }

  get(): Promise<ApiResponse<ScriptSchedule[]>>;
  get(id: number): Promise<ApiResponse<ScriptSchedule>>;
  async get(id?: number | null): Promise<ApiResponse<ScriptSchedule | ScriptSchedule[]>> {
    if (id != null) {
      this.setId(id);
    }
    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, ScriptSchedule);
  }

  async create(
    cronExpression: string,
    servers: number[],
  ): Promise<ApiResponse<ScriptSchedule>> {
    this.setId(null);
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { cron_expression: cronExpression, servers },
    }, ScriptSchedule);
    this.setId(response.getDataId());
    return response;
  }

  async update(
    cronExpression?: string | null,
    servers?: number[] | null,
  ): Promise<ApiResponse<ScriptSchedule>> {
    this.setIdOrFail();
    this.buildEndpoint();

    const body: Record<string, unknown> = {};
    if (cronExpression != null) body.cron_expression = cronExpression;
    if (servers != null) body.servers = servers;

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', { body }, ScriptSchedule);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async toggle(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/toggle`, 'post');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<ScriptSchedule[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.pageModels(listOf(ScriptSchedule), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<ScriptSchedule[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.searchModels(searchQuery, listOf(ScriptSchedule));
  }
}
