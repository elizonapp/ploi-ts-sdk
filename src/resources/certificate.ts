import { ApiResponse, listOf } from '../http/response';
import { Certificate } from '../models/certificate';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class CertificateResource extends Resource {
  constructor(server: ServerResource, site: SiteResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}/certificates`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Certificate[]>>;
  get(id: number): Promise<ApiResponse<Certificate>>;
  async get(id?: number | null): Promise<ApiResponse<Certificate | Certificate[]>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getId() === null
      ? this.page()
      : this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Certificate);
  }

  async create(
    certificate: string,
    type = 'letsencrypt',
    force = false,
    options: {
      private?: string;
      additional?: Record<string, unknown>;
    } = {},
  ): Promise<ApiResponse<Certificate>> {
    this.setId(null);
    this.buildEndpoint();

    const body: Record<string, unknown> = { certificate, type, force };
    if (options.private != null) body.private = options.private;
    if (options.additional != null) body.additional = options.additional;

    const response = await this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body,
    }, Certificate);
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
  ): Promise<ApiResponse<Certificate[]>> {
    return this.pageModels(listOf(Certificate), pageNumber, amountPerPage);
  }

  override async search(searchQuery: string): Promise<ApiResponse<Certificate[]>> {
    return this.searchModels(searchQuery, listOf(Certificate));
  }
}
