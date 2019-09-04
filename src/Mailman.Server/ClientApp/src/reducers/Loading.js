import { STOP_HARD_LOAD, START_HARD_LOAD } from '../actions/Loading'

const initialState = {
  hardLoad: false
}

export const reducer = (state, action) => {
  state = state || initialState

  switch (action.type) {
    case START_HARD_LOAD:
      return {
        ...state,
        hardLoad: true,
      }

    case STOP_HARD_LOAD:
      return {
        ...state,
        hardLoad: false,
      }
    default:
      return state
  }
}
