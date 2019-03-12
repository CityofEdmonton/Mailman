import { connect } from 'react-redux';

import TitlePage from './TitlePage';
import { updateTitlePage } from '../../actions/createMergeTemplate'

function mapStateToProps(state) {
    const { mergeTemplates, currentMergeTemplate } = state;
    return ({
        mergeTemplates: mergeTemplates.mergeTemplates,
        currentMergeTemplate: currentMergeTemplate
    });
}

function mapDispatchToProps(dispatch) {
    return({
        updateTitlePage: (title, timestamp) => {
            dispatch(updateTitlePage(title, timestamp));
        }
    });
}

export const TitlePageContainer = connect(mapStateToProps, mapDispatchToProps)(TitlePage);