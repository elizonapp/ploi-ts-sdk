export class RequiresId extends Error {
  constructor(message = 'This action requires an ID to be set') {
    super(message);
    this.name = 'RequiresId';
  }
}
