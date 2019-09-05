import {
  REQUEST_MERGE_TEMPLATES,
  RECEIVE_MERGE_TEMPLATES,
  requestMergeTemplates,
  receiveMergeTemplates,
} from '../actions/ReadMergeTemplates'
//import fetch from 'cross-fetch'; //most browsers don't natively support fetch yet, should install the npm package

const initialState = {
  mergeTemplates: [],
  isLoading: false, //I feel like this is not actually a thing that should be included
  sheetId: '',
}

function handleErrors(response) {
  if (!response.ok) {
    console.log('Failed')
    throw Error(response.statusText)
  }

  return response
}

export default (state, action) => {
  // state = initialState
  state = state || initialState

  switch (action.type) {
    case REQUEST_MERGE_TEMPLATES:
      return {
        ...state,
        //sheetId: action.payload.sheetId, //will you need to map merge templates to something?
        isLoading: true,
      }

    case RECEIVE_MERGE_TEMPLATES:
      return {
        ...state,
        sheetId: action.payload.spreadsheetId, //think about payload
        mergeTemplates: action.payload.mergeTemplates,
        isLoading: false,
      }
  }
  //case failure
  return state
}
