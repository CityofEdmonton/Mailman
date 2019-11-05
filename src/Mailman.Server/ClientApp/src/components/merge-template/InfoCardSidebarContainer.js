import { connect } from 'react-redux'
import InfoCardSidebar from './InfoCardSidebar'
import { deleteMergeTemplate } from '../../actions/MergeTemplates'

const mapDispatchToProps = {
  deleteMergeTemplate,
}

export const InfoCardSidebarContainer = connect(
  null,
  mapDispatchToProps,
)(InfoCardSidebar)
