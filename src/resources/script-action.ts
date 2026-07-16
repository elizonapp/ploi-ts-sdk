import { ApiResponse, listOf } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';
import { ScriptAction } from '../models/script-action';
import { Resource } from './resource';
import type { ScriptResource } from './script';

export class ScriptActionResource extends Resource {
  private readonly script: ScriptResource;

  constructor(script: ScriptResource, id?: number | null) {
    super(script.getPloi(), id);
    this.script = script;
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    const scriptId = this.script.getId();
    if (scriptId == null) {
      throw new RequiresId('Script ID is required for actions');
    }

    let path = `scripts/${scriptId}/actions`;
    if (this.getId()) {
      path += `/${this.getId()}`;
    }
    this.setEndpoint(path);
    return this;
  }

  get(): Promise<ApiResponse<ScriptAction[]>>;
  get(id: number): Promise<ApiResponse<ScriptAction>>;
  async get(id?: number | null): Promise<ApiResponse<ScriptAction | ScriptAction[]>> {
    if (id != null) {
      this.setId(id);
    }
    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, ScriptAction);
  }

  async create(
    trigger: string,
    servers: number[],
    delaySeconds?: number | null,
  ): Promise<ApiResponse<ScriptAction>> {
    this.setId(null);
    this.buildEndpoint();

    const body: Record<string, unknown> = { trigger, servers };
    if (delaySeconds != null) {
      body.delay_seconds = delaySeconds;
    }

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body,
    }, ScriptAction);
    this.setId(response.getDataId());
    return response;
  }

  async update(
    trigger?: string | null,
    servers?: number[] | null,
    delaySeconds?: number | null,
  ): Promise<ApiResponse<ScriptAction>> {
    this.setIdOrFail();
    this.buildEndpoint();

    const body: Record<string, unknown> = {};
    if (trigger != null) body.trigger = trigger;
    if (servers != null) body.servers = servers;
    if (delaySeconds != null) body.delay_seconds = delaySeconds;

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', { body }, ScriptAction);
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

  async rotateSecret(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.buildEndpoint();
    return this.getPloi()!.makeAPICall(`${this.getEndpoint()}/rotate-secret`, 'post');
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<ScriptAction[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.pageModels(listOf(ScriptAction), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<ScriptAction[]>> {
    this.setId(null);
    this.buildEndpoint();
    return this.searchModels(searchQuery, listOf(ScriptAction));
  }
}
