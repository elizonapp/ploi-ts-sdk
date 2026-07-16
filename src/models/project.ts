import { Model } from './model';

export interface ProjectSiteRef {
  id: number;
  root_domain: string;
}

export interface ProjectAttributes {
  id: number;
  title: string;
  servers: unknown[];
  sites: ProjectSiteRef[];
  created_at: string;
}

export class Project extends Model<ProjectAttributes> {
  get id(): number { return this.attrs.id; }
  get title(): string { return this.attrs.title; }
  get servers(): unknown[] { return this.attrs.servers; }
  get sites(): ProjectSiteRef[] { return this.attrs.sites; }
  get createdAt(): string { return this.attrs.created_at; }

  static from(data: unknown): Project {
    return new Project(Model.requireObject<ProjectAttributes>(data));
  }

  static fromMany(data: unknown): Project[] {
    return Model.requireArray(data).map((item) => Project.from(item));
  }
}

