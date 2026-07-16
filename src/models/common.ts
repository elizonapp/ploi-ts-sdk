export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string | number;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links?: PaginationMetaLink[];
}

export interface ApiMessage {
  message?: string;
}

export type JsonObject = Record<string, unknown>;

/** @see https://developers.ploi.io/getting-started/resource-statuses */
export const ServerStatus = {
  Created: 'created',
  CreatingFailed: 'creating-failed',
  Building: 'building',
  BuildingFailed: 'building-failed',
  Active: 'active',
  Unreachable: 'unreachable',
  Destroying: 'destroying',
  Refreshing: 'refreshing',
  Rebooting: 'rebooting',
} as const;
export type ServerStatus = (typeof ServerStatus)[keyof typeof ServerStatus];

export const SiteStatus = {
  Created: 'created',
  Building: 'building',
  Active: 'active',
  Deploying: 'deploying',
  DeployFailed: 'deploy-failed',
  Suspended: 'suspended',
  RepositoryInstalling: 'repository-installing',
  RepositoryUninstalling: 'repository-uninstalling',
  WordpressInstalling: 'wordpress-installing',
  WordpressUninstalling: 'wordpress-uninstalling',
  NextcloudInstalling: 'nextcloud-installing',
  NextcloudUninstalling: 'nextcloud-uninstalling',
  StatamicInstalling: 'statamic-installing',
  StatamicUninstalling: 'statamic-uninstalling',
  OctobercmsInstalling: 'octobercms-installing',
  OctobercmsUninstalling: 'octobercms-uninstalling',
  CloneInProgress: 'clone-in-progress',
  StagingProductionSyncing: 'staging-production-syncing',
  Deleting: 'deleting',
} as const;
export type SiteStatus = (typeof SiteStatus)[keyof typeof SiteStatus];

export const DatabaseStatus = {
  Created: 'created',
  Active: 'active',
  Deleting: 'deleting',
} as const;
export type DatabaseStatus = (typeof DatabaseStatus)[keyof typeof DatabaseStatus];

export const CronjobStatus = {
  Created: 'created',
  Active: 'active',
  Deleting: 'deleting',
} as const;
export type CronjobStatus = (typeof CronjobStatus)[keyof typeof CronjobStatus];

export const DaemonStatus = {
  Created: 'created',
  Active: 'active',
  Restarting: 'restarting',
  Deleting: 'deleting',
} as const;
export type DaemonStatus = (typeof DaemonStatus)[keyof typeof DaemonStatus];

export const QueueStatus = {
  Created: 'created',
  Active: 'active',
  Restarting: 'restarting',
  Deleting: 'deleting',
} as const;
export type QueueStatus = (typeof QueueStatus)[keyof typeof QueueStatus];

export const NetworkRuleStatus = {
  Created: 'created',
  Active: 'active',
  Deleting: 'deleting',
} as const;
export type NetworkRuleStatus = (typeof NetworkRuleStatus)[keyof typeof NetworkRuleStatus];

export const CertificateStatus = {
  Created: 'created',
  Active: 'active',
  Deleting: 'deleting',
} as const;
export type CertificateStatus = (typeof CertificateStatus)[keyof typeof CertificateStatus];

export const RedirectStatus = {
  Created: 'created',
  Active: 'active',
  Destroying: 'destroying',
} as const;
export type RedirectStatus = (typeof RedirectStatus)[keyof typeof RedirectStatus];

export const SshKeyStatus = {
  Created: 'created',
  Active: 'active',
  Destroying: 'destroying',
} as const;
export type SshKeyStatus = (typeof SshKeyStatus)[keyof typeof SshKeyStatus];
