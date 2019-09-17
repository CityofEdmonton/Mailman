export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'

export function fetchLogin(signalrId) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  return dispatch => {
    dispatch(requestLogin())
    window.open(`/api/login/signin?SignalrId=${signalrId}`)
  }
}

export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  }
}

export function receiveLogin(json) {
  return {
    type: RECEIVE_LOGIN,
    payload: {
      user: json,
    },
  }
}