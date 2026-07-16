import { Model } from './model';

export interface RedirectAttributes {
  id: number;
  status: string;
  redirect_from: string;
  redirect_to: string;
  type: string;
}

export class Redirect extends Model<RedirectAttributes> {
  get id(): number { return this.attrs.id; }
  get status(): string { return this.attrs.status; }
  get redirectFrom(): string { return this.attrs.redirect_from; }
  get redirectTo(): string { return this.attrs.redirect_to; }
  get type(): string { return this.attrs.type; }

  static from(data: unknown): Redirect {
    return new Redirect(Model.requireObject<RedirectAttributes>(data));
  }

  static fromMany(data: unknown): Redirect[] {
    return Model.requireArray(data).map((item) => Redirect.from(item));
  }
}

