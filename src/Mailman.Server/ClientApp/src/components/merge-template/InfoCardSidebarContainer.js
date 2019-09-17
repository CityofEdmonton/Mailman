import { connect } from 'react-redux'
import { loadFromMergeTemplates } from '../../actions/CreateMergeTemplate'

import InfoCardSidebar from './InfoCardSidebar'

function mapStateToProps(state) {
  const { mergeTemplates } = state
  return {
    mergeTemplates: state.readMergeTemplates.mergeTemplates,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadFromMergeTemplates: templateID => {
      dispatch(loadFromMergeTemplates(templateID))
    },
  }
}

export const InfoCardSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoCardSidebar)
