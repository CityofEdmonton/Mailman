import { SignalRClient } from '../SignalrClient'
import configureStore from '../store/ConfigureStore'
import { stopHardLoad, startHardLoad } from './Loading'

export const RECEIVE_SIGNALR_ID = 'RECEIVE_SIGNALR_ID'
export const REQUEST_SIGNALR_ID = 'REQUEST_SIGNALR_ID'
const FRIENDLY_TASK = 'Contacting server...'

// All users of these actions should wait until the client
// is ready before sending messages.
let client = null
let readyClient = null

export function fetchSignalrId() {
  if (!client) {
    client = new SignalRClient('/hub', configureStore())
    readyClient = client.start().then(() => {
      return client
    })
  }
  return dispatch => {
    dispatch(requestSignalrId())
    return readyClient
      .then(client => {
        return client.connection.invoke('GetConnectionId')
      })
      .then(id => {
        dispatch(receiveSignalrId(id))
        return id
      })
  }
}

export function requestSignalrId() {
  return dispatch => {
    dispatch(startHardLoad(FRIENDLY_TASK))
    dispatch({
      type: REQUEST_SIGNALR_ID,
    })
  }
}

export function receiveSignalrId(id) {
  return dispatch => {
    dispatch({
      type: RECEIVE_SIGNALR_ID,
      payload: {
        id,
      },
    })
    dispatch(stopHardLoad(FRIENDLY_TASK))
  }
}
