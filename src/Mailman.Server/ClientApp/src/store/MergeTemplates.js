import { REQUEST_MERGE_TEMPLATES, RECEIVE_MERGE_TEMPLATES } from './actionTypes';
//import fetch from 'cross-fetch'; //most browsers don't natively support fetch yet, should install the npm package

const initialState = {
  mergeTemplates: [
    {
      "id": "21234",
      "type": "Email",
      "createdBy": "string",
      "createdDateUtc": "2018-11-28T21:40:16.876Z",
      "version": "string",
      "title": "Test",
      "sheetName": "string",
      "headerRowNumber": 0,
      "timestampColumn": {
        "name": "string",
        "shouldPrefixNameWithMergeTemplateTitle": true,
        "title": "string"
      },
      "conditional": "string",
      "repeater": "Off"
    },
    {
      "id": "2234442",
      "type": "Email",
      "createdBy": "string",
      "createdDateUtc": "2018-11-28T21:40:16.876Z",
      "version": "string",
      "title": "Test2",
      "sheetName": "string",
      "headerRowNumber": 0,
      "timestampColumn": {
        "name": "string",
        "shouldPrefixNameWithMergeTemplateTitle": true,
        "title": "string"
      },
      "conditional": "string",
      "repeater": "Off"
    }
  ],
  isLoading: false, //I feel like this is not actually a thing that should be included
  sheetId: ''
};


const requestMergeTemplates = (spreadsheetId) => ( {
  type: REQUEST_MERGE_TEMPLATES,
  spreadsheetId
});

const receiveMergeTemplates = (spreadsheetId, json) => ({
  type: RECEIVE_MERGE_TEMPLATES,
  
  payload: {
    mergeTemplates: json,
    spreadsheetId: spreadsheetId}

});

const config = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
 };

export function fetchMergeTemplates(spreadsheetId) {

  return dispatch => {
    dispatch(requestMergeTemplates(spreadsheetId));
    return fetch(`https://localhost:5001/api/MergeTemplates/${spreadsheetId}`, config)
      .then(response => {
        console.log(response)
        return response.json()})
      .then(json => {
        //debugger
        console.log('Made it to this part! ', json[0]);
        dispatch(receiveMergeTemplates(spreadsheetId, json))
        return json;})
  };
}

function handleErrors(response) {
  if (!response.ok) {
    console.log('Failed');
    throw Error(response.statusText);
  }

  return response;
}

function shouldFetchMergeTemplates() {
  //TODO: make it so we don't issue a duplicate request 
  //if isLoading is true, return false
  //if we already have the data return false

  return true;
}

export function fetchMergeTemplatesIfNeeded(spreadsheetId) {
 
  return (dispatch, getState) => {

    if(shouldFetchMergeTemplates(spreadsheetId)) {
      
      return dispatch(fetchMergeTemplates(spreadsheetId))

    }
  }

}

export const reducer = (state, action) => { // state = initialState
  state = state || initialState;
  
  switch (action.type) {

    case REQUEST_MERGE_TEMPLATES:
      return {
        ...state,
        //sheetId: action.payload.sheetId, //will you need to map merge templates to something?
        isLoading: true
      }

    case RECEIVE_MERGE_TEMPLATES:
      return {
        ...state,
        sheetId: action.payload.spreadsheetId, //think about payload
        mergeTemplates: action.payload.mergeTemplates,
        isLoading: false
      };
  }
  //case failure 
  return state;
};
