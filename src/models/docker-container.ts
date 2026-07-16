import { Model } from './model';

export interface DockerContainerAttributes {
  id: number;
  name: string;
  deploy_script?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export class DockerContainer extends Model<DockerContainerAttributes> {
  get id(): number { return this.attrs.id; }
  get name(): string { return this.attrs.name; }
  get deployScript(): string | undefined { return this.attrs.deploy_script; }
  get status(): string | undefined { return this.attrs.status; }
  get createdAt(): string | undefined { return this.attrs.created_at; }

  static from(data: unknown): DockerContainer {
    return new DockerContainer(Model.requireObject<DockerContainerAttributes>(data));
  }

  static fromMany(data: unknown): DockerContainer[] {
    return Model.requireArray(data).map((item) => DockerContainer.from(item));
  }
}
