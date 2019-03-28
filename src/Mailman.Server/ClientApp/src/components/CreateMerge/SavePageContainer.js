import { connect } from 'react-redux';

import SavePage from './SavePage';

function mapStateToProps(state) {
    const { currentMergeTemplate } = state;
    return ({
        currentMergeTemplate: currentMergeTemplate,
    });
}

export const SavePageContainer = connect(mapStateToProps)(SavePage);