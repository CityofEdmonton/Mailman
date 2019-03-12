import { connect } from 'react-redux';

import TabSelection from './TabSelection';

function mapStateToProps(state, ownProps) {
    const { currentMergeTemplate } = state; // Get this from the store
    return ({
        currentMergeTemplate: currentMergeTemplate // Send the current merge template id being editted/created in to TabSelection
        // id: "placeholder" //
    });
}

export const TabSelectionContainer = connect(mapStateToProps)(TabSelection);