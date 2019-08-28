export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'

export function fetchLogin() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return dispatch => {
    dispatch(requestLogin())
    return fetch(`https://localhost:5001/api/login/signin`, config)
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch(receiveLogin(json))
        return json
      })
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
