import { startHardLoad, stopHardLoad } from './Loading'
import { submitError } from './Error'

export const REQUEST_MERGE_TEMPLATES = 'REQUEST_MERGE_TEMPLATES'
export const RECEIVE_MERGE_TEMPLATES = 'RECEIVE_MERGE_TEMPLATES'
const FRIENDLY_TASK = 'Grabbing Merge Templates...'
export const REQUEST_SAVE_MERGE_TEMPLATE = 'REQUEST_SAVE_MERGE_TEMPLATE'
export const RECEIVE_SAVE_MERGE_TEMPLATE = 'RECEIVE_SAVE_MERGE_TEMPLATE'
export const REQUEST_DELETE_MERGE_TEMPLATE = 'REQUEST_DELETE_MERGE_TEMPLATE'
export const RECEIVE_DELETE_MERGE_TEMPLATE = 'RECEIVE_DELETE_MERGE_TEMPLATE'

export function deleteMergeTemplate(templateId) {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      MergeTemplateId: templateId,
    }),
  }

  return dispatch => {
    dispatch(requestDeleteMergeTemplate(templateId))
    return fetch(
      `${process.env.REACT_APP_BASE_URL}/api/MergeTemplates/Email`,
      config
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
      .then(status => {
        dispatch(receiveDeleteMergeTemplate(templateId))
      })
      .catch(err => {
        dispatch(submitError(err))
      })
  }
}

export function receiveDeleteMergeTemplate(templateId) {
  return dispatch => {
    dispatch({
      type: RECEIVE_DELETE_MERGE_TEMPLATE,
      payload: templateId,
    })
  }
}

export function requestDeleteMergeTemplate(templateId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_MERGE_TEMPLATE,
      payload: templateId,
    })
  }
}

export function fetchSaveMergeTemplate(template) {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  }

  if (!template.id) {
    config.method = 'POST'
  }

  return dispatch => {
    dispatch(requestSaveMergeTemplate(template))
    fetch(`${process.env.REACT_APP_BASE_URL}/api/MergeTemplates/Email`, config)
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
        dispatch(receiveSaveMergeTemplate(json))
      })
      .catch(err => {
        dispatch(submitError(err))
      })
  }
}

export function receiveSaveMergeTemplate(template) {
  return dispatch => {
    dispatch({
      type: RECEIVE_SAVE_MERGE_TEMPLATE,
      payload: template,
    })
  }
}

export function requestSaveMergeTemplate(template) {
  return dispatch => {
    dispatch({
      type: REQUEST_SAVE_MERGE_TEMPLATE,
      payload: template,
    })
  }
}

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
      `${process.env.REACT_APP_BASE_URL}/api/MergeTemplates/${spreadsheetId}`,
      config
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
        dispatch(receiveMergeTemplates(spreadsheetId, json))
        return json
      })
      .catch(err => {
        dispatch(submitError(err))
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
