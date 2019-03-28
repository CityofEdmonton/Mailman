import { connect } from 'react-redux';

import EmailBody from './EmailBody';
import { updateEmailBody } from '../../actions/createMergeTemplate'

function mapStateToProps(state) {
    const { currentMergeTemplate, mergeTemplates } = state;
    return ({
        currentMergeTemplate: currentMergeTemplate,
        spreadsheetId: mergeTemplates.sheetId
    });
}

function mapDispatchToProps(dispatch) {
    return({
        updateEmailBody: (body) => {
            dispatch(updateEmailBody(body))
        }
    });
}

export const EmailBodyContainer = connect(mapStateToProps, mapDispatchToProps)(EmailBody);