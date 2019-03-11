/**
 * Reducer for the "Create" logic of a new merge
 * 
 */

import {
    LOAD_FROM_MERGE_TEMPLATES,
    UPDATE_TITLE_PAGE,
    UPDATE_TAB_SELECTION
} from '../actions/createMergeTemplate';
  
const initialState = {
    "emailTemplate": {
        "to": "",
        "cc": "",
        "bcc": "",
        "subject": "",
        "body": ""
    },
    "id": "",
    "type": "",
    "createdBy": "",
    "createdDateUtc": "",
    "version": "",
    "title": "",
    "sheetName": "",
    "headerRowNumber": 0,
    "timestampColumn": {
        "name": "",
        "shouldPrefixNameWithMergeTemplateTitle": true,
        "title": ""
    },
    "conditional": "",
    "repeater": ""
};

export function currentMergeTemplateReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_FROM_MERGE_TEMPLATES:
            if (action.mergeTemplate) {
                return action.mergeTemplate// payload will be the entire merge template
            } else {
                return initialState;
            }
        case UPDATE_TITLE_PAGE:
            return [
                ...state,
                {
                    title: action.payload.title,
                    timestampColumn: {
                        ...state.timestampColumn,
                        shouldPrefixNameWithMergeTemplateTitle: action.payload.timestamp
                    }
                }
            ];
        case UPDATE_TAB_SELECTION:
            return [
                ...state,
                {
                    sheetName: action.payload.tab
                }
            ];
        default:
            return state;
    }
}