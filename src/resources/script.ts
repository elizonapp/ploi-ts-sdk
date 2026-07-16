import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { RequiresId } from '../exceptions/resource/requires-id';
import { Script } from '../models/script';
import { Resource } from './resource';
import { ScriptScheduleResource } from './script-schedule';
import { ScriptActionResource } from './script-action';

export class ScriptResource extends Resource {
  private readonly resourcePath = 'scripts';

  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.setEndpoint(this.resourcePath);
  }

  get(): Promise<ApiResponse<Script[]>>;
  get(id: number): Promise<ApiResponse<Script>>;
  async get(id?: number | null): Promise<ApiResponse<Script | Script[]>> {
    if (id != null) {
      this.setId(id);
    }

    if (this.getId()) {
      this.setEndpoint(`${this.resourcePath}/${this.getId()}`);
    } else {
      this.setEndpoint(this.resourcePath);
    }

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Script);
  }

  async create(label: string, user: string, content: string): Promise<ApiResponse<Script>> {
    this.setId(null);
    this.setEndpoint(this.resourcePath);

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { label, user, content },
    }, Script);
    this.setId(response.getDataId());

    return response;
  }

  async update(label: string, user: string, content: string): Promise<ApiResponse<Script>> {
    this.setIdOrFail();
    this.setEndpoint(`${this.resourcePath}/${this.getId()}`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'patch', {
      body: { label, user, content },
    }, Script);
  }

  async delete(id?: number | null): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);
    this.setEndpoint(`${this.resourcePath}/${this.getId()}`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'delete');
  }

  async run(id?: number | null, serverIds: number[] = []): Promise<ApiResponse<unknown>> {
    this.setIdOrFail(id);

    if (!serverIds.length) {
      throw new RequiresId('Server IDs are required');
    }

    this.setEndpoint(`${this.resourcePath}/${this.getId()}/run`);

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { servers: serverIds },
    });
  }

  schedules(id?: number | null): ScriptScheduleResource {
    this.setIdOrFail();
    return new ScriptScheduleResource(this, id);
  }

  actions(id?: number | null): ScriptActionResource {
    this.setIdOrFail();
    return new ScriptActionResource(this, id);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<Script[]>> {
    return this.pageModels(listOf(Script), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Script[]>> {
    return this.searchModels(searchQuery, listOf(Script));
  }
}
