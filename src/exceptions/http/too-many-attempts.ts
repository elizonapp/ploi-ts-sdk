export class TooManyAttempts extends Error {
  constructor(message = 'Accessing the API too quickly') {
    super(message);
    this.name = 'TooManyAttempts';
  }
}
