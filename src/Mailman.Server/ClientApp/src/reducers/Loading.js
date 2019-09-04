import { STOP_HARD_LOAD, START_HARD_LOAD } from '../actions/Loading'

const initialState = []

export const reducer = (state, action) => {
  state = state || initialState

  switch (action.type) {
    case START_HARD_LOAD:
      return [
        ...state,
        action.payload.task
      ]

    case STOP_HARD_LOAD:
      return state.filter((item, index) => {
        if (item === action.payload.task) {
          return false
        }
        return true
      })
    default:
      return state
  }
}
