import { ApiResponse, type ModelFactory } from './http/response';
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

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

export type ApiCallOptions = {
  body?: string | object;
  headers?: Record<string, string>;
};

export class Ploi {
  private url = 'https://ploi.io/api/';
  private apiToken: string | null = null;

  constructor(token?: string | null) {
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

  async makeAPICall<T = unknown>(
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
        throw new TooManyAttempts(bodyText || undefined);
      case 500:
        throw new InternalServerError(bodyText || undefined);
      case 503:
        throw new PerformingMaintenance(bodyText || undefined);
    }

    return new ApiResponse<T>(response, bodyText, factory);
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
}
