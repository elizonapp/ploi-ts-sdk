import { ApiResponse } from '../http/response';
import { SiteTenants } from '../models/tenant';
import { Resource } from './resource';
import type { SiteResource } from './site';

export class TenantResource extends Resource {
  constructor(site: SiteResource) {
    super(site.getPloi());
    this.setSite(site);
    this.buildEndpoint();
  }

  buildEndpoint(): this {
    this.setEndpoint(`${this.getSite().getEndpoint()}/tenants`);
    return this;
  }

  async get(): Promise<ApiResponse<SiteTenants>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'get', {}, SiteTenants);
  }

  async create(tenants: string[]): Promise<ApiResponse<SiteTenants>> {
    return this.getPloi()!.makeAPICall(this.getEndpoint()!, 'post', {
      body: { tenants },
    }, SiteTenants);
  }

  async delete(tenant?: string | null): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${tenant}`;
    return this.getPloi()!.makeAPICall(url, 'delete');
  }

  async requestCertificate(
    tenant: string,
    webhook?: string | null,
    domains = '',
    force?: boolean,
  ): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${tenant}/request-certificate`;
    const body: Record<string, unknown> = { webhook, domains };
    if (force != null) body.force = force;
    return this.getPloi()!.makeAPICall(url, 'post', { body });
  }

  async revokeCertificate(tenant: string, webhook: string): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${tenant}/revoke-certificate`;
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: { webhook },
    });
  }

  async getNginxConfiguration(tenant: string): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/${tenant}/nginx-configuration`,
    );
  }

  async updateNginxConfiguration(
    tenant: string,
    content: string,
  ): Promise<ApiResponse<unknown>> {
    return this.getPloi()!.makeAPICall(
      `${this.getEndpoint()}/${tenant}/nginx-configuration`,
      'patch',
      { body: { content } },
    );
  }
}
