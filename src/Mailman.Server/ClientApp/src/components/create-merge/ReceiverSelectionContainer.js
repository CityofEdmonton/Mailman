import { connect } from 'react-redux'

import ReceiverSelection from './ReceiverSelection'
import { updateReceiverSelection } from '../../actions/CreateMergeTemplate'

function mapStateToProps(state) {
  const { currentMergeTemplate, mergeTemplates } = state
  return {
    currentMergeTemplate: currentMergeTemplate,
    spreadsheetId: mergeTemplates.sheetId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateReceiverSelection: (to, cc, bcc) => {
      dispatch(updateReceiverSelection(to, cc, bcc))
    },
  }
}

export const ReceiverSelectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiverSelection)
