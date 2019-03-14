import { connect } from 'react-redux';

import ReceiverSelection from './ReceiverSelection';

function mapStateToProps(state) {
    const { currentMergeTemplate, mergeTemplates } = state;
    return ({
        currentMergeTemplate: currentMergeTemplate,
        spreadsheetId: mergeTemplates.sheetId
    });
}

function mapDispatchToProps(dispatch) {
    return({
        
    });
}

export const ReceiverSelectionContainer = connect(mapStateToProps, undefined)(ReceiverSelection);