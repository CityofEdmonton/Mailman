import { SUBMIT_ERROR } from '../actions/Error'

const initialState = []

export default (state, action) => {
  state = state || initialState

  switch (action.type) {
    case SUBMIT_ERROR:
      return [...state, action.payload.error]

    default:
      return state
  }
}
