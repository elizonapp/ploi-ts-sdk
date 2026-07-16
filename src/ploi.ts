import { ApiResponse, type ModelFactory } from './http/response';
import { AsyncPool } from './http/async-pool';
import { Unauthenticated } from './exceptions/http/unauthenticated';
import { NotFound } from './exceptions/http/not-found';
import { NotAllowed } from './exceptions/http/not-allowed';
import { NotValid } from './exceptions/http/not-valid';
import { TooManyAttempts } from './exceptions/http/too-many-attempts';
import { InternalServerError } from './exceptions/http/internal-server-error';
import { PerformingMaintenance } from './exceptions/http/performing-maintenance';
import { ServerResource } from './resources/server';
import { ProjectResource } from './resources/project';
import { ScriptResource } from './resources/script';
import { StatusPageResource } from './resources/status-page';
import { UserResource } from './resources/user';
import { WebserverTemplateResource } from './resources/webserver-template';
import { FileBackupResource } from './resources/file-backup';
import { DatabaseBackupResource } from './resources/database-backup';
import { SynchronizeResource } from './resources/synchronize';

export const MCP_URL = 'https://ploi.io/api/mcp';

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

export type ApiCallOptions = {
  body?: string | object;
  headers?: Record<string, string>;
};

export type PloiOptions = {
  /** Required by the Ploi API. Defaults to `@elizonapp/ploi-ts-sdk/1.0.0`. */
  userAgent?: string;
  /** Reactive 429 pool (burst → retry every 1s → burst). Default: true. */
  rateLimitPool?: boolean;
  /** Delay between 429 retries in ms. Default: 1000. */
  rateLimitRetryIntervalMs?: number;
};

const DEFAULT_USER_AGENT = '@elizonapp/ploi-ts-sdk/1.0.0';

export class Ploi {
  private url = 'https://ploi.io/api/';
  private apiToken: string | null = null;
  private userAgent: string;
  private rateLimitPoolEnabled: boolean;
  private readonly pool: AsyncPool;

  constructor(token?: string | null, options: PloiOptions = {}) {
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.rateLimitPoolEnabled = options.rateLimitPool !== false;
    this.pool = new AsyncPool({
      retryIntervalMs: options.rateLimitRetryIntervalMs ?? 1000,
    });

    if (token) {
      this.setApiToken(token);
    }
  }

  setApiToken(token: string): this {
    this.apiToken = token;
    return this;
  }

  getApiToken(): string {
    if (!this.apiToken) {
      throw new Error('API token is not set. Call setApiToken() first.');
    }
    return this.apiToken;
  }

  setUserAgent(userAgent: string): this {
    this.userAgent = userAgent;
    return this;
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  setRateLimitPool(enabled: boolean): this {
    this.rateLimitPoolEnabled = enabled;
    return this;
  }

  isRateLimitPoolEnabled(): boolean {
    return this.rateLimitPoolEnabled;
  }

  async makeAPICall<T = unknown>(
    url: string,
    method: HttpMethod = 'get',
    options: ApiCallOptions = {},
    factory?: ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    const run = () => this.executeAPICall(url, method, options, factory);

    if (!this.rateLimitPoolEnabled) {
      return run();
    }

    return this.pool.schedule(run);
  }

  private async executeAPICall<T = unknown>(
    url: string,
    method: HttpMethod = 'get',
    options: ApiCallOptions = {},
    factory?: ModelFactory<T>,
  ): Promise<ApiResponse<T>> {
    const allowed: HttpMethod[] = ['get', 'post', 'patch', 'delete'];
    if (!allowed.includes(method)) {
      throw new Error('Invalid method type');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.getApiToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this.userAgent,
      ...options.headers,
    };

    const init: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (options.body !== undefined && method !== 'get') {
      init.body =
        typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body);
    }

    const absoluteUrl = url.startsWith('http')
      ? url
      : `${this.url}${url.replace(/^\//, '')}`;

    const response = await fetch(absoluteUrl, init);
    const bodyText = await response.text();

    switch (response.status) {
      case 401:
        throw new Unauthenticated(bodyText || undefined);
      case 404:
        throw new NotFound(bodyText || undefined);
      case 405:
        throw new NotAllowed(bodyText || undefined);
      case 422:
        throw new NotValid(bodyText || undefined);
      case 429:
        throw TooManyAttempts.fromResponse(response, bodyText);
      case 500:
        throw new InternalServerError(bodyText || undefined);
      case 503:
        throw new PerformingMaintenance(bodyText || undefined);
    }

    return new ApiResponse<T>(response, bodyText, factory);
  }

  /** Easter-egg endpoint. */
  async teapot(): Promise<ApiResponse<unknown>> {
    return this.makeAPICall('teapot');
  }

  /** Ploi worker / monitor IP addresses for firewall allowlists. */
  async ips(): Promise<ApiResponse<unknown>> {
    return this.makeAPICall('ips');
  }

  server(id?: number | null): ServerResource {
    return new ServerResource(this, id);
  }

  servers(id?: number | null): ServerResource {
    return this.server(id);
  }

  project(id?: number | null): ProjectResource {
    return new ProjectResource(this, id);
  }

  projects(id?: number | null): ProjectResource {
    return this.project(id);
  }

  scripts(id?: number | null): ScriptResource {
    return new ScriptResource(this, id);
  }

  statusPage(id?: number | null): StatusPageResource {
    return new StatusPageResource(this, id);
  }

  user(): UserResource {
    return new UserResource(this);
  }

  webserverTemplates(id?: number | null): WebserverTemplateResource {
    return new WebserverTemplateResource(this, id);
  }

  fileBackup(id?: number | null): FileBackupResource {
    return new FileBackupResource(this, id);
  }

  fileBackups(id?: number | null): FileBackupResource {
    return this.fileBackup(id);
  }

  databaseBackup(id?: number | null): DatabaseBackupResource {
    return DatabaseBackupResource.root(this, id);
  }

  databaseBackups(id?: number | null): DatabaseBackupResource {
    return this.databaseBackup(id);
  }

  synchronize(): SynchronizeResource {
    return new SynchronizeResource(this);
  }
}
