export class NotValid extends Error {
  constructor(message = 'Sent options were not valid') {
    super(message);
    this.name = 'NotValid';
  }
}
