import { ApiResponse, listOf } from '../http/response';
import {
  WordpressPlugin,
  WordpressTheme,
  WordpressRepository,
} from '../models/wordpress';
import { Resource } from './resource';
import type { SiteResource } from './site';

export class WordpressResource extends Resource {
  constructor(site: SiteResource) {
    super(site.getPloi());
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getSite().getEndpoint()}/wordpress`);
    return this;
  }

  private withOndemand(url: string, ondemand?: boolean): string {
    if (!ondemand) {
      return url;
    }
    return url.includes('?') ? `${url}&ondemand=true` : `${url}?ondemand=true`;
  }

  // --- Plugins ---

  async plugins(ondemand?: boolean): Promise<ApiResponse<WordpressPlugin[]>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'get', {}, listOf(WordpressPlugin));
  }

  async installPlugin(
    plugin: string,
    activate?: boolean,
    ondemand?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins/install`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: { plugin, activate },
    });
  }

  async activatePlugin(plugin: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins/activate`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { plugin } });
  }

  async deactivatePlugin(plugin: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins/deactivate`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { plugin } });
  }

  async updatePlugin(plugin: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins/update`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { plugin } });
  }

  async deletePlugin(plugin: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/plugins/delete`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'delete', { body: { plugin } });
  }

  // --- Themes ---

  async themes(ondemand?: boolean): Promise<ApiResponse<WordpressTheme[]>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'get', {}, listOf(WordpressTheme));
  }

  async installTheme(
    theme: string,
    activate?: boolean,
    ondemand?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes/install`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: { theme, activate },
    });
  }

  async activateTheme(theme: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes/activate`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { theme } });
  }

  async deactivateTheme(theme: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes/deactivate`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { theme } });
  }

  async updateTheme(theme: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes/update`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { theme } });
  }

  async deleteTheme(theme: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/themes/delete`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'delete', { body: { theme } });
  }

  // --- Repositories ---

  async repositories(ondemand?: boolean): Promise<ApiResponse<WordpressRepository[]>> {
    const url = this.withOndemand(`${this.getEndpoint()}/repositories`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'get', {}, listOf(WordpressRepository));
  }

  async installRepository(
    provider: string,
    name: string,
    branch: string,
    targetDirectory: string,
    options: {
      source_provider_id?: number;
      ondemand?: boolean;
    } = {},
  ): Promise<ApiResponse<WordpressRepository>> {
    const { ondemand, ...bodyFields } = options;
    const url = this.withOndemand(`${this.getEndpoint()}/repositories`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: {
        provider,
        name,
        branch,
        target_directory: targetDirectory,
        ...bodyFields,
      },
    }, WordpressRepository);
  }

  async updateRepository(
    id: number,
    fields: {
      user?: string;
      name?: string;
      branch?: string;
    },
    ondemand?: boolean,
  ): Promise<ApiResponse<WordpressRepository>> {
    const url = this.withOndemand(`${this.getEndpoint()}/repositories/${id}`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'patch', { body: fields }, WordpressRepository);
  }

  async deleteRepository(id: number, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/repositories/${id}`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'delete');
  }

  async deployRepository(id: number, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/repositories/${id}/deploy`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post');
  }

  async deployAllRepositories(ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/repositories/deploy-all`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post');
  }

  async updateRepositoryDeployScript(
    id: number,
    script: string,
    ondemand?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(
      `${this.getEndpoint()}/repositories/${id}/deploy-script`,
      ondemand,
    );
    return this.getPloi()!.makeAPICall(url, 'patch', { body: { script } });
  }

  // --- Misc ---

  async completeInstall(
    siteTitle: string,
    adminUsername: string,
    adminEmail: string,
    adminPassword: string,
    ondemand?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/complete-install`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: {
        site_title: siteTitle,
        admin_username: adminUsername,
        admin_email: adminEmail,
        admin_password: adminPassword,
      },
    });
  }

  async searchReplace(
    search: string,
    replace: string,
    dryRun?: boolean,
    ondemand?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/search-replace`, ondemand);
    const body: Record<string, unknown> = { search, replace };
    if (dryRun != null) body.dry_run = dryRun;
    return this.getPloi()!.makeAPICall(url, 'post', { body });
  }

  async toggleXmlrpc(block: boolean, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/toggle-xmlrpc`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { block } });
  }

  async runWpCli(command: string, ondemand?: boolean): Promise<ApiResponse<unknown>> {
    const url = this.withOndemand(`${this.getEndpoint()}/wp-cli/run`, ondemand);
    return this.getPloi()!.makeAPICall(url, 'post', { body: { command } });
  }
}
