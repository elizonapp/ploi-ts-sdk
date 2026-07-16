export class NotAllowed extends Error {
  constructor(message = 'Method not allowed') {
    super(message);
    this.name = 'NotAllowed';
  }
}
