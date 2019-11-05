import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import PlayIcon from '@material-ui/icons/PlayArrow'
import CreateIcon from '@material-ui/icons/Create'
import ViewIcon from '@material-ui/icons/Visibility'
import { IconButton } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import PropTypes from 'prop-types'
import MailmanLink from '../MailmanLink'
import { deleteMergeTemplate } from '../../actions/MergeTemplates'

const styles = theme => ({
  smallIcon: {
    width: 32,
    height: 32,
    padding: 0,
  },
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconList: {
    paddingTop: 50,
  },
})

class InfoCardSidebar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <List disablePadding={true} className={classes.iconList}>
          <ListItem className={classes.root}>
            <IconButton
              className={classes.smallIcon}
              onClick={this.props.deleteMergeTemplate.bind(this, this.props.id)}
            >
              <Tooltip title="Delete" placement="left">
                <DeleteIcon style={{ color: 'red' }} />
              </Tooltip>
            </IconButton>
          </ListItem>
          <ListItem className={classes.root}>
            <IconButton className={classes.smallIcon}>
              <Tooltip title="Run" placement="left">
                <PlayIcon style={{ color: 'green' }} />
              </Tooltip>
            </IconButton>
          </ListItem>
          <ListItem className={classes.root}>
            <IconButton className={classes.smallIcon}>
              <MailmanLink to={`/mergeTemplate/${this.props.id}`}>
                <Tooltip title="Edit" placement="left">
                  <CreateIcon style={{ color: 'grey' }} />
                </Tooltip>
              </MailmanLink>
            </IconButton>
          </ListItem>
          <ListItem className={classes.root}>
            <IconButton className={classes.smallIcon}>
              <Tooltip title="Preview" placement="left">
                <ViewIcon style={{ color: 'black' }} />
              </Tooltip>
            </IconButton>
          </ListItem>
        </List>
      </div>
    )
  }
}

InfoCardSidebar.propTypes = {
  id: PropTypes.string.isRequired,
  deleteMergeTemplate: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  deleteMergeTemplate,
}

export default withStyles(styles, { withTheme: true })(
  connect(
    null,
    mapDispatchToProps
  )(InfoCardSidebar)
)
