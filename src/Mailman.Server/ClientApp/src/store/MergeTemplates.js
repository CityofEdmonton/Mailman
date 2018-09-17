const requestMergeTemplatesType = "REQUEST_MERGE_TEMPLATES";
const receiveMergeTemplatesType = "RECEIVE_MERGE_TEMPLATES";
const initialState = {
  mergeTemplates: [
    {
      mergeRepeater: null,
      mergeData: {
        type: "Email",
        data: {
          to: "a.person@edmonton.ca",
          cc: "jared.rewerts@edmonton.ca",
          bcc: "",
          subject: "Early Bird Rate Extended - Open Data Summit || <<Name>>",
          body: "<h3>TEST</h3>"
        },
        title: "Early Bird Rate - Demo",
        sheet: "Notification Type Mailman",
        headerRow: "1",
        timestampColumn: "<<Mailman Email Timestamp>>",
        conditional: "<<Final Validation>>"
      },
      createdBy: "Unknown user",
      createdDatetime: "9/6/2018 12:17:13",
      id: "_42ktles0m"
    }
  ],
  isLoading: false
};

export const actionCreators = {
  requestMergeTemplates: sheetId => async (dispatch, getState) => {
    if (sheetId === getState().mergeTemplates.sheetId) {
      // Don't issue a duplicate request (we already have or are loading the requested data)
      return;
    }

    dispatch({ type: requestMergeTemplatesType, sheetId });

    const url = `api/MergeTemplates?sheet=${sheetId}`;
    const response = await fetch(url);
    const mergeTemplates = await response.json();

    dispatch({ type: receiveMergeTemplatesType, sheetId, mergeTemplates });
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestMergeTemplatesType) {
    return {
      ...state,
      sheetId: action.sheetId,
      isLoading: true
    };
  }

  if (action.type === receiveMergeTemplatesType) {
    return {
      ...state,
      sheetId: action.sheetId,
      mergeTemplates: action.mergeTemplates,
      isLoading: false
    };
  }

  return state;
};
