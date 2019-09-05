import { HubConnectionBuilder } from '@aspnet/signalr'
import { START_HARD_LOAD, STOP_HARD_LOAD } from './actions/Loading'
import { receiveSignalrId } from './actions/Login'

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
    let action = {
      type: START_HARD_LOAD,
      payload: {
        task: 'Connecting to Signalr Server'
      }
    }
    this.store.dispatch(action)

    return this.connection.start().then(() => {
      return this.connection.invoke('GetConnectionId')
    }).then((id) => {
      this.store.dispatch(receiveSignalrId(id))
      let action = {
        type: STOP_HARD_LOAD,
        payload: {
          task: 'Connecting to Signalr Server'
        }
      }
      this.store.dispatch(action)
    })
  }
}