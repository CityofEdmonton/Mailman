import { HubConnectionBuilder } from '@aspnet/signalr'
import { receiveUser } from './actions/User'

export class SignalRClient {
  constructor(connection, store) {
    this.store = store
    this.connection = new HubConnectionBuilder().withUrl(connection).build()
  }

  start = () => {
    // This wires the backend up to dispatch Redux actions.
    this.connection.on('REDUX_ACTION', (method, payload) => {
      let action = {
        type: method,
        payload,
      }
      this.store.dispatch(action)
    })

    // This handles receiving the user after they login.
    this.connection.on('USER_LOGIN', user => {
      this.store.dispatch(receiveUser(user))
    })

    return this.connection.start()
  }
}
