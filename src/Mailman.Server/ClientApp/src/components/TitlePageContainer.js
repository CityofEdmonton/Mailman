import { connect } from 'react-redux';

import TitlePage from './TitlePage';
import { updateTitlePage } from '../actions/createMergeTemplate'

function mapStateToProps(state) {
    const { currentMergeTemplate } = state;
    return ({
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