// TODO: FIX THIS!
export const REQUEST_SHEET_TABS = "REQUEST_SHEET_TABS";

export function fetchSheetTabs(spreadsheetId) {
    const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    };

    return dispatch => {
        dispatch(requestSheetTabs(spreadsheetId));
        return fetch(`https://localhost:5001/api/Sheets/SheetNames/${spreadsheetId}`, config)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(json => {
            dispatch(receiveSheetTabs(spreadsheetId, json));
            return json;
        })
    };
}

export function requestSheetTabs(spreadsheetId) {
    return {
        type: REQUEST_SHEET_TABS,
        spreadsheetId
    }
}
  
export function receiveSheetTabs(spreadsheetId, json) {
    return {
        type: RECEIVE_SHEET_TABS,
        payload: {
            sheetTabs: json,
            spreadsheetId
        }
    }   
}