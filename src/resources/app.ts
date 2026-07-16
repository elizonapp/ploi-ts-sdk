import { ApiResponse } from '../http/response';
import { NotValid } from '../exceptions/http/not-valid';
import { Site } from '../models/site';
import { Resource } from './resource';
import type { ServerResource } from './server';
import type { SiteResource } from './site';

export class AppResource extends Resource {
  constructor(server: ServerResource, site: SiteResource, id?: number | null) {
    super(server.getPloi(), id);
    this.setServer(server);
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(
      `${this.getServer().getEndpoint()}/${this.getServer().getId()}/sites/${this.getSite().getId()}`,
    );

    if (this.getId()) {
      this.setEndpoint(`${this.getEndpoint()}/${this.getId()}`);
    }

    return this;
  }

  get(): Promise<ApiResponse<Site>>;
  get(id: number): Promise<ApiResponse<Site>>;
  async get(id?: number | null): Promise<ApiResponse<Site>> {
    if (id != null) {
      this.setId(id);
    }

    this.buildEndpoint();

    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, Site);
  }

  /**
   * Install an application on the site.
   * On validation errors, returns the parsed error payload (mirrors PHP SDK).
   */
  async install(
    type = 'wordpress',
    options: {
      create_database?: boolean;
      type?: string;
      provider?: string;
      name?: string;
      private?: boolean;
      description?: string;
      installation_type?: string;
      [key: string]: unknown;
    } = {},
  ): Promise<unknown> {
    this.setId(null);
    this.buildEndpoint();

    const body: Record<string, unknown> = { ...options };
    if (body.create_database === undefined && type !== 'statamic') {
      body.create_database = false;
    }

    try {
      const response = await this.getPloi()!.makeAPICall(
        `${this.getEndpoint()}/${type}`,
        'post',
        { body },
      );

      this.setId(response.getDataId());
      return response.getData();
    } catch (error) {
      if (error instanceof NotValid) {
        try {
          return JSON.parse(error.message);
        } catch {
          return { message: error.message };
        }
      }
      throw error;
    }
  }

  async uninstall(type: string): Promise<boolean> {
    this.buildEndpoint();

    const response = await this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/${type}`,
      'delete',
    );

    return response.getStatus() === 200;
  }
}
