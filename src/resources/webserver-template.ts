import type { Ploi } from '../ploi';
import { ApiResponse, listOf } from '../http/response';
import { WebserverTemplate } from '../models/webserver-template';
import { Resource } from './resource';

export class WebserverTemplateResource extends Resource {
  private readonly resourcePath = 'webserver-templates';

  constructor(ploi?: Ploi | null, id?: number | null) {
    super(ploi, id);
    this.setEndpoint(this.resourcePath);
  }

  get(): Promise<ApiResponse<WebserverTemplate[]>>;
  get(id: number): Promise<ApiResponse<WebserverTemplate>>;
  async get(id?: number | null): Promise<ApiResponse<WebserverTemplate | WebserverTemplate[]>> {
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
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, WebserverTemplate);
  }

  override async page(
    pageNumber = 1,
    amountPerPage?: number | null,
  ): Promise<ApiResponse<WebserverTemplate[]>> {
    return this.pageModels(listOf(WebserverTemplate), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<WebserverTemplate[]>> {
    return this.searchModels(searchQuery, listOf(WebserverTemplate));
  }
}
