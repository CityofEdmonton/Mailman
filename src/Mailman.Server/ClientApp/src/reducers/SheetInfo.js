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
      return {
        sheets: {
          ...state.sheets,
          ...{
            [action.payload.spreadsheetId]: {
              tabs: state.sheets[action.payload.spreadsheetId].tabs,
              headers: action.payload.headers,
              loading: false,
            },
          },
        },
      }
    case REQUEST_ROW_HEADERS:
      // Always initialise with an empty list, but don't overwrite old results.
      let headers = []
      if (
        state.sheets[action.spreadsheetId] &&
        state.sheets[action.spreadsheetId].headers
      ) {
        headers = state.sheets[action.spreadsheetId].headers
      }
      return {
        sheets: {
          ...state.sheets,
          ...{
            [action.spreadsheetId]: { loading: true, tabs: state.sheets[action.spreadsheetId].tabs,  headers },
          },
        },
      }

    case RECEIVE_SHEET_TABS:
      return {
        sheets: {
          ...state.sheets,
          ...{
            [action.payload.spreadsheetId]: {
              tabs: action.payload.tabs,
              headers: [],
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
            [action.spreadsheetId]: { loading: true, tabs, headers: [] },
          },
        },
      }

    default:
      return state
  }
}
