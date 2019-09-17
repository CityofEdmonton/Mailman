import { HubConnectionBuilder } from '@aspnet/signalr'

export class SignalRClient {
  constructor(connection, store) {
    this.store = store
    this.connection = new HubConnectionBuilder()
      .withUrl(connection)
      .build();
  }

  start = () => {
    // This wires the backend up to dispatch Redux actions.
    this.connection.on('REDUX_ACTION', (method, payload) => {
      let action = {
        type: method,
        payload
      }
      this.store.dispatch(action)
    })

    return this.connection.start()
  }
}