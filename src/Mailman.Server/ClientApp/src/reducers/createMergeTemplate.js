/**
 * Reducer for the "Create" logic of a new merge
 * 
 */

import {
    LOAD_FROM_MERGE_TEMPLATES,
    UPDATE_TITLE_PAGE,
    UPDATE_TAB_SELECTION,
    UPDATE_HEADER_TITLES,
    UPDATE_RECEIVER_SELECTION,
    UPDATE_VERSION_NUMBER
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
    "headerRowNumber": 1,
    "timestampColumn": {
        "name": "",
        "shouldPrefixNameWithMergeTemplateTitle": true,
        "title": ""
    },
    "conditional": "",
    "repeater": ""
};

// TODO: generate a unique id -> inital state
// TODO: split reducer into parts (e.g. one for emailTemplate, one for timestampColumn... etc...)

export function currentMergeTemplateReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_FROM_MERGE_TEMPLATES:
            if (action.mergeTemplate) {
                return action.mergeTemplate// payload will be the entire merge template
            } else {
                return initialState;
            }
        case UPDATE_TITLE_PAGE:
            return ({
                ...state,
                title: action.payload.title,
                timestampColumn: {
                    ...state.timestampColumn,
                    shouldPrefixNameWithMergeTemplateTitle: action.payload.timestamp
                }
            });
        case UPDATE_TAB_SELECTION:
            return ({
                ...state,
                sheetName: action.payload.tab
            });
        case UPDATE_HEADER_TITLES:
            return ({
                ...state,
                headerRowNumber: parseInt(action.payload.header)
            })
        case UPDATE_RECEIVER_SELECTION:
            return({
                ...state,
                emailTemplate: {
                    ...state.emailTemplate,
                    to: action.payload.to,
                    cc: action.payload.cc,
                    bcc: action.payload.bcc
                }
            })
        case UPDATE_VERSION_NUMBER:
            return ({
                ...state,
                version: state.version // TODO: calculate new version number
            });
        default:
            return state;
    }
}