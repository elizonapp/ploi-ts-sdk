import { Model } from './model';

export interface DeployScriptAttributes {
  deploy_script: string;
}

export class DeployScript extends Model<DeployScriptAttributes> {
  get deployScript(): string { return this.attrs.deploy_script; }

  static from(data: unknown): DeployScript {
    if (typeof data === 'string') {
      return new DeployScript({ deploy_script: data });
    }
    return new DeployScript(Model.requireObject<DeployScriptAttributes>(data));
  }
}

export interface DeployResultAttributes {
  message: string;
}

export class DeployResult extends Model<DeployResultAttributes> {
  get message(): string { return this.attrs.message; }

  static from(data: unknown): DeployResult {
    if (typeof data === 'string') {
      return new DeployResult({ message: data });
    }
    return new DeployResult(Model.requireObject<DeployResultAttributes>(data));
  }
}

