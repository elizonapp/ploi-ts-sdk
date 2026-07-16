export class RequiresServiceName extends Error {
  constructor(message = 'Service name is required') {
    super(message);
    this.name = 'RequiresServiceName';
  }
}
