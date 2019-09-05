import { REQUEST_LOGIN, RECEIVE_LOGIN, RECEIVE_SIGNALR_ID } from '../actions/Login'

const initialState = {
  user: {},
  signalrId: null
}

export const reducer = (state, action) => {
  state = state || initialState

  switch (action.type) {
    case REQUEST_LOGIN:
      return {
        ...state,
      }

    case RECEIVE_LOGIN:
      return {
        ...state,
        user: action.payload.user,
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
