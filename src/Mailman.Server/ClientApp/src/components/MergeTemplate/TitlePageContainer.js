import { connect } from 'react-redux';

import TitlePage from './TitlePage';
import { loadFromMergeTemplates } from '../../actions/createMergeTemplate'

function mapStateToProps(state) {
    const { mergeTemplates, currentMergeTemplate } = state;
    return ({
        mergeTemplates: mergeTemplates.mergeTemplates,
        currentMergeTemplate: currentMergeTemplate
    });
}

function mapDispatchToProps(dispatch) {
    return({
        loadFromMergeTemplates: (templateID) => {
            dispatch(loadFromMergeTemplates(templateID))
        }
    });
}

export const TitlePageContainer = connect(mapStateToProps, mapDispatchToProps)(TitlePage);