/// This reducer handles actions for User, Login and Signalr

import {
  REQUEST_ROW_HEADERS,
  RECEIVE_ROW_HEADERS,
  REQUEST_SHEET_TABS,
  RECEIVE_SHEET_TABS,
} from '../actions/SheetInfo'

const initialState = {
  sheets: {},
}

export default (state, action) => {
  state = state || initialState

  switch (action.type) {
    case RECEIVE_ROW_HEADERS:
      throw new Error('Not implemented')
    case REQUEST_ROW_HEADERS:
      throw new Error('Not implemented')

    case RECEIVE_SHEET_TABS:
      return {
        sheets: {
          ...state.sheets,
          ...{
            [action.payload.spreadsheetId]: {
              tabs: action.payload.tabs,
              loading: false,
            },
          },
        },
      }

    case REQUEST_SHEET_TABS:
      // Always initialise with an empty list, but don't overwrite old results.
      let tabs = []
      if (
        state.sheets[action.spreadsheetId] &&
        state.sheets[action.spreadsheetId].tabs
      ) {
        tabs = state.sheets[action.spreadsheetId].tabs
      }
      return {
        sheets: {
          ...state.sheets,
          ...{
            [action.spreadsheetId]: { loading: true, tabs },
          },
        },
      }

    default:
      return state
  }
}
