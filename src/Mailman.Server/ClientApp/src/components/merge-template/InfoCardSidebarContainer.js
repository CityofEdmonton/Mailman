import { connect } from 'react-redux'
import InfoCardSidebar from './InfoCardSidebar'
import { deleteMergeTemplate } from '../../actions/MergeTemplates'

function mapStateToProps(state) {
  return {
    mergeTemplates: state.mergeTemplates.mergeTemplates,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteMergeTemplate,
  }
}

export const InfoCardSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoCardSidebar)
