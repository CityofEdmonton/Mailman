import {
  REQUEST_MERGE_TEMPLATES,
  RECEIVE_MERGE_TEMPLATES,
  REQUEST_SAVE_MERGE_TEMPLATE,
  RECEIVE_SAVE_MERGE_TEMPLATE,
  REQUEST_DELETE_MERGE_TEMPLATE,
  RECEIVE_DELETE_MERGE_TEMPLATE,
} from '../actions/MergeTemplates'

const initialState = {
  mergeTemplates: [],
  isLoading: false,
  sheetId: '',
}

export default (state, action) => {
  state = state || initialState

  let updatedTemplates
  switch (action.type) {
    case REQUEST_MERGE_TEMPLATES:
      return {
        ...state,
        isLoading: true,
      }

    case RECEIVE_MERGE_TEMPLATES:
      return {
        ...state,
        sheetId: action.payload.spreadsheetId,
        mergeTemplates: action.payload.mergeTemplates,
        isLoading: false,
      }
    case REQUEST_SAVE_MERGE_TEMPLATE:
      return {
        ...state,
        isLoading: true,
      }
    case RECEIVE_SAVE_MERGE_TEMPLATE:
      if (state.mergeTemplates.find(el => el.id === action.payload.id)) {
        updatedTemplates = state.mergeTemplates.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      } else {
        updatedTemplates = [...state.mergeTemplates, action.payload]
      }

      return {
        ...state,
        mergeTemplates: updatedTemplates,
        isLoading: false,
      }
    case REQUEST_DELETE_MERGE_TEMPLATE:
      return {
        ...state,
        isLoading: true,
      }
    case RECEIVE_DELETE_MERGE_TEMPLATE:
      updatedTemplates = state.mergeTemplates.filter(
        t => t.id !== action.payload
      )
      return {
        ...state,
        mergeTemplates: updatedTemplates,
        isLoading: false,
      }
    default:
      return state
  }
}
