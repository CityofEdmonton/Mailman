import { connect } from 'react-redux';

import TabSelection from './TabSelection';
import { updateTabSelection } from '../../actions/createMergeTemplate'

function mapStateToProps(state, ownProps) {
    const { currentMergeTemplate } = state; // Get this from the store
    return ({
        currentMergeTemplate: currentMergeTemplate // Send the current merge template id being editted/created in to TabSelection
    });
}

function mapDispatchToProps(dispatch) {
    return({
        updateTabSelection: (tab) => {
            dispatch(updateTabSelection(tab));
        }
    });
}

export const TabSelectionContainer = connect(mapStateToProps, mapDispatchToProps)(TabSelection);