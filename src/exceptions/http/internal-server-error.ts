export class InternalServerError extends Error {
  constructor(message = 'Ploi is having issues') {
    super(message);
    this.name = 'InternalServerError';
  }
}
