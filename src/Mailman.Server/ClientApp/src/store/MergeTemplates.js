import { REQUEST_MERGE_TEMPLATES, RECEIVE_MERGE_TEMPLATES, FETCH_MERGE_TEMPLATES_REQUEST, FETCH_MERGE_TEMPLATES_SUCCESS, FETCH_MERGE_TEMPLATES_FAILURE } from './actionTypes';
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

// const fetchMergeTemplatesFailure = error => ({
//   type: FETCH_MERGE_TEMPLATES_FAILURE,
//   payload: { error }
// });

//change into ES6 syntax
// export function fetchMergeTemplates(spreadsheetId) {
//   console.log('Made it here (fetchMergeTemplates)!')
//   return dispatch => {
//     dispatch(fetchMergeTemplatesRequest());
//     return fetch(`/api/MergeTemplates/${spreadsheetId}`)
//       .then(handleErrors)
//       .then(res => {
//         console.log('here')
//         return res.json()})
//       .then(data => {
//         console.log('howdy')
//         dispatch(fetchMergeTemplatesSuccess(data.mergeTemplates));
//         return data.mergeTemplates;
//       })
//       .catch(error => dispatch(fetchMergeTemplatesFailure(error)));
//   };
// }

const config = {
  method: 'GET',
  //mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
 };

export function fetchMergeTemplates(spreadsheetId) {
  //var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  return dispatch => {
    dispatch(requestMergeTemplates(spreadsheetId));
    return fetch(`https://localhost:5001/api/MergeTemplates/${spreadsheetId}`, config)
      .then(response => {
        console.log(response)
        return response.text()})
      .then(json => {
        //debugger
        console.log('Made it to this part! ', json[0]);
        dispatch(receiveMergeTemplates(spreadsheetId, json))})
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
  console.log('fetchMerge')
  return (dispatch, getState) => {

    if(shouldFetchMergeTemplates(spreadsheetId)) {
      
      return dispatch(fetchMergeTemplates(spreadsheetId))

    }
  }

}

// export const actionCreators = {
//   requestMergeTemplates: sheetId => async (dispatch, getState) => {
//     if (sheetId === getState().mergeTemplates.sheetId) {
//       // Don't issue a duplicate request (we already have or are loading the requested data)
//       return;
//     }

//     dispatch({ type: requestMergeTemplatesType, sheetId });

//     const url = `api/MergeTemplates?sheet=${sheetId}`;
//     const response = await fetch(url);
//     const mergeTemplates = await response.json();

//     dispatch({ type: receiveMergeTemplatesType, sheetId, mergeTemplates });
//   }

  //receive merge templates here
// };





export const reducer = (state, action) => { // state = initialState
  state = state || initialState;
  
  switch (action.type) {

    case FETCH_MERGE_TEMPLATES_REQUEST:
      return {
        ...state,
        //sheetId: action.payload.sheetId, //will you need to map merge templates to something?
        isLoading: true
      }

    case FETCH_MERGE_TEMPLATES_SUCCESS:
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
