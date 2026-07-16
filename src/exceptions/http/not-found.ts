export class NotFound extends Error {
  constructor(message = 'Endpoint not found') {
    super(message);
    this.name = 'NotFound';
  }
}
