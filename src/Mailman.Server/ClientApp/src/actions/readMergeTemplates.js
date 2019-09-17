import { startHardLoad, stopHardLoad } from './Loading'

export const REQUEST_MERGE_TEMPLATES = 'REQUEST_MERGE_TEMPLATES'
export const RECEIVE_MERGE_TEMPLATES = 'RECEIVE_MERGE_TEMPLATES'
const FRIENDLY_TASK = 'Grabbing Merge Templates...'

function shouldFetchMergeTemplates() {
  //TODO: make it so we don't issue a duplicate request
  return true
}

export function fetchMergeTemplatesIfNeeded(spreadsheetId) {
  return (dispatch, getState) => {
    if (shouldFetchMergeTemplates(spreadsheetId)) {
      return dispatch(fetchMergeTemplates(spreadsheetId))
    }
  }
}

export function fetchMergeTemplates(spreadsheetId) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return dispatch => {
    dispatch(requestMergeTemplates(spreadsheetId))
    return fetch(
      `https://localhost:5001/api/MergeTemplates/${spreadsheetId}`,
      config
    )
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        dispatch(receiveMergeTemplates(spreadsheetId, json))
        return json
      })
  }
}

export function requestMergeTemplates(spreadsheetId) {
  return dispatch => {
    dispatch(startHardLoad(FRIENDLY_TASK))
    dispatch({
      type: REQUEST_MERGE_TEMPLATES,
      spreadsheetId,
    })
  }
}

export function receiveMergeTemplates(spreadsheetId, json) {
  return dispatch => {
    dispatch({
      type: RECEIVE_MERGE_TEMPLATES,
      payload: {
        mergeTemplates: json,
        spreadsheetId: spreadsheetId,
      },
    })
    dispatch(stopHardLoad(FRIENDLY_TASK))
  }
}
