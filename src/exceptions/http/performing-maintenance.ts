export class PerformingMaintenance extends Error {
  constructor(message = 'Ploi is performing maintenance') {
    super(message);
    this.name = 'PerformingMaintenance';
  }
}
