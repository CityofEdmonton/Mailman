import { connect } from 'react-redux';

import HeaderSelection from './HeaderSelection';
import { updateHeaderSelection } from '../../actions/createMergeTemplate'

function mapStateToProps(state) {
    const { currentMergeTemplate } = state; // Get this from the store
    return ({
        currentMergeTemplate: currentMergeTemplate, // Send the current merge template id being editted/created in to TabSelection
    });
}

function mapDispatchToProps(dispatch) {
    return({
        updateHeaderSelection: (header) => {
            dispatch(updateHeaderSelection(header));
        }
    });
}

export const HeaderSelectionContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderSelection);