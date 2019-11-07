import { startHardLoad, stopHardLoad } from './Loading'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const FRIENDLY_TASK = 'Logging in...'

export function fetchLogin(signalrId) {
  return dispatch => {
    dispatch(requestLogin())
    window.open(`/api/login/signin?SignalrId=${signalrId}`)
  }
}

export function requestLogin() {
  return dispatch => {
    dispatch(startHardLoad(FRIENDLY_TASK))
    dispatch({
      type: REQUEST_LOGIN,
    })
  }
}

export function receiveLogin(json) {
  return dispatch => {
    dispatch(stopHardLoad(FRIENDLY_TASK))
    dispatch({
      type: RECEIVE_LOGIN,
      payload: {
        user: json,
      },
    })
  }
}
