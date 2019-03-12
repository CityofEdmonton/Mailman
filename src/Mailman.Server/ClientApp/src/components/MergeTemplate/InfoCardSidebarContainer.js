import { connect } from 'react-redux';
import { loadFromMergeTemplates } from '../../actions/createMergeTemplate';

import InfoCardSidebar from './InfoCardSidebar';

function mapStateToProps(state) {
    const { mergeTemplates } = state;
    return ({
        mergeTemplates: mergeTemplates.mergeTemplates
    });
}

function mapDispatchToProps(dispatch) {
    return({
        loadFromMergeTemplates: (templateID) => {
            dispatch(loadFromMergeTemplates(templateID))
        }
    });
}

export const InfoCardSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(InfoCardSidebar);