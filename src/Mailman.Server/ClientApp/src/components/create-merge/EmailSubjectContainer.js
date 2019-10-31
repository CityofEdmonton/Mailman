import { connect } from 'react-redux'

import EmailSubject from './EmailSubject'
import { updateEmailSubject } from '../../actions/CreateMergeTemplate'

function mapStateToProps(state) {
  const { currentMergeTemplate, mergeTemplates } = state
  return {
    currentMergeTemplate: currentMergeTemplate,
    spreadsheetId: mergeTemplates.sheetId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateEmailSubject: subject => {
      dispatch(updateEmailSubject(subject))
    },
  }
}

export const EmailSubjectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailSubject)
