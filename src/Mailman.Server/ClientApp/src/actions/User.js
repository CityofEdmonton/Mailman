import UnauthorizedError from '../errors/UnauthorizedError'
import NoSignalrIdError from '../errors/NoSignalrIdError'
import { fetchLogin } from './Login'
import configureStore from '../store/ConfigureStore'
import { stopHardLoad } from './Loading'
import { FRIENDLY_TASK } from './Login'

export const RECEIVE_USER = 'RECEIVE_USER'

export function fetchUser() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  return fetch('/api/user/me', config).then(jsonResponse => {
    console.log(jsonResponse)
    if (jsonResponse.status == 401) {
      return Promise.reject(new UnauthorizedError())
    }
    return jsonResponse.json()
  })
}

export function fetchMe() {
  return dispatch => {
    return fetchUser().then(
      (user) => dispatch(receiveUser(user)),
      (err) => {
        if (err instanceof UnauthorizedError) {
          console.log('Engage login flow')
          let store = configureStore()
          if (!store.getState().user.signalrId) {
            return Promise.reject(new NoSignalrIdError())
          }
          
          dispatch(fetchLogin(store.getState().user.signalrId))
          return
        }
        
        throw err
      }
    )
  }
}

/**
 * Receives a user. 
 * This function is extremely similar to Login.receiveLogin. 
 * This function is meant to be used when a user is already 
 * logged in, whereas receiveLogin is immediately after notifying
 * of a successful log in event.
 * @param {*} json The user object.
 */
export function receiveUser(json) {
  return dispatch => {
    dispatch(stopHardLoad(FRIENDLY_TASK))
    dispatch({
      type: RECEIVE_USER,
      payload: {
        user: json,
      },
    })
  }
  
}