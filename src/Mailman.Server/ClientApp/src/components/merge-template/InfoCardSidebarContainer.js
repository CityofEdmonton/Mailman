import { connect } from 'react-redux'

import InfoCardSidebar from './InfoCardSidebar'

function mapStateToProps(state) {
  return {
    mergeTemplates: state.mergeTemplates.mergeTemplates,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export const InfoCardSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoCardSidebar)
