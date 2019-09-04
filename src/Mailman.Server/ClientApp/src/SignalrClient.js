import { HubConnectionBuilder } from '@aspnet/signalr'
import { START_HARD_LOAD, STOP_HARD_LOAD } from './actions/Loading'

export class SignalRClient {
  constructor(connection, store) {
    this.store = store
    this.connection = new HubConnectionBuilder()
      .withUrl(connection)
      .build();
  }

  start = () => {
    this.connection.on('ReceiveMessage', (user, message) => {
      console.log(user)
      console.log(message)
    })
    let action = {
      type: START_HARD_LOAD,
      payload: {
        task: 'Connecting to Signalr Server'
      }
    }
    this.store.dispatch(action)

    return this.connection.start().then(() => {
      console.log(this)
      let action = {
        type: STOP_HARD_LOAD,
        payload: {
          task: 'Connecting to Signalr Server'
        }
      }
      this.store.dispatch(action)
      return this.connection.invoke('RegisterConnection', 'test')
    })
  }
}