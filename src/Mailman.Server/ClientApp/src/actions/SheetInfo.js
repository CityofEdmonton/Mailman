import { submitError } from './Error'

export const REQUEST_SHEET_TABS = 'REQUEST_SHEET_TABS'
export const RECEIVE_SHEET_TABS = 'RECEIVE_SHEET_TABS'
export const REQUEST_ROW_HEADERS = 'REQUEST_ROW_HEADERS'
export const RECEIVE_ROW_HEADERS = 'RECEIVE_ROW_HEADERS'

export function fetchSheetTabs(spreadsheetId) {
  return dispatch => {
    dispatch(requestSheetTabs(spreadsheetId))
    fetch(`${process.env.REACT_APP_BASE_URL}/api/sheets/sheetnames/${spreadsheetId}`)
      .then(response => {
        if (response.ok) {
          return response
        }
        throw new Error(`${response.status}: ${response.statusText}`)
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch(receiveSheetTabs(spreadsheetId, json))
        return json
      })
      .catch(err => {
        dispatch(submitError(err))
      })
  }
}

export function requestSheetTabs(spreadsheetId) {
  return dispatch => {
    dispatch({
      type: REQUEST_SHEET_TABS,
      spreadsheetId,
    })
  }
}

export function receiveSheetTabs(spreadsheetId, json) {
  return dispatch => {
    dispatch({
      type: RECEIVE_SHEET_TABS,
      payload: {
        spreadsheetId,
        tabs: json,
      },
    })
  }
}

export function fetchSheetHeaders(spreadsheetId, tab, row) {
  return dispatch => {
    dispatch(requestSheetHeaders(spreadsheetId, tab, row))
    fetch(
      `${process.env.REACT_APP_BASE_URL}/api/sheets/RowValues/${spreadsheetId}/${tab}?rowNumber=${row}`
    )
      .then(response => {
        if (response.ok) {
          return response
        }
        throw new Error(`${response.status}: ${response.statusText}`)
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch(receiveSheetHeaders(spreadsheetId, tab, row, json))
        return json
      })
      .catch(err => {
        dispatch(submitError(err))
      })
  }
}

export function requestSheetHeaders(spreadsheetId, tab, row) {
  return dispatch => {
    dispatch({
      type: REQUEST_ROW_HEADERS,
      spreadsheetId,
      tab,
      row,
    })
  }
}

export function receiveSheetHeaders(spreadsheetId, tab, row, json) {
  return dispatch => {
    dispatch({
      type: RECEIVE_ROW_HEADERS,
      payload: {
        spreadsheetId,
        tab,
        row,
        headers: json,
      },
    })
  }
}
