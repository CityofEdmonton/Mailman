import { REQUEST_LOGIN, RECEIVE_LOGIN } from '../actions/Login'

const initialState = {
  user: {},
  isLoading: true,
}

export const reducer = (state, action) => {
  state = state || initialState

  switch (action.type) {
    case REQUEST_LOGIN:
      return {
        ...state,
        isLoading: true,
      }

    case RECEIVE_LOGIN:
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
      }
    default:
      return state
  }
}
