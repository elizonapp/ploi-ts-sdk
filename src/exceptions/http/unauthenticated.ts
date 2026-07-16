export class Unauthenticated extends Error {
  constructor(message = 'Cannot authenticate with Ploi') {
    super(message);
    this.name = 'Unauthenticated';
  }
}
