export default class NoSignalrIdError extends Error {
  constructor() {
    super('No SignalR ID has been defined.')
  }
}