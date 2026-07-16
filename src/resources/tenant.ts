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
  ): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${tenant}/request-certificate`;
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: { webhook, domains },
    });
  }

  async revokeCertificate(tenant: string, webhook: string): Promise<ApiResponse<unknown>> {
    const url = `${this.getEndpoint()}/${tenant}/revoke-certificate`;
    return this.getPloi()!.makeAPICall(url, 'post', {
      body: { webhook },
    });
  }
}
