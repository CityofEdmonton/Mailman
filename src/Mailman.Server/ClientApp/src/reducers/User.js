/// This reducer handles actions for User, Login and Signalr

import { RECEIVE_USER } from '../actions/User'
import { REQUEST_LOGIN, RECEIVE_LOGIN } from '../actions/Login'
import { REQUEST_SIGNALR_ID, RECEIVE_SIGNALR_ID } from '../actions/Signalr'



const initialState = {
  user: {},
  signalrId: null
}

export default (state, action) => {
  state = state || initialState

  switch (action.type) {
    case RECEIVE_USER:
      return {
        ...state,
        user: action.payload.user,
      }
    case REQUEST_LOGIN:
      return {
        ...state,
      }

    case RECEIVE_LOGIN:
      return {
        ...state,
        user: action.payload.user,
      }
    
    case REQUEST_SIGNALR_ID:
      return {
        ...state,
      }

    case RECEIVE_SIGNALR_ID:
      return {
        ...state,
        signalrId: action.payload.id,
      }
    default:
      return state
  }
}