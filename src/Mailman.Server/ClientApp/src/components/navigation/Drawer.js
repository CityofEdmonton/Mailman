import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SettingsIcon from '@material-ui/icons/Settings'
import DraftsIcon from '@material-ui/icons/Drafts'
import HistoryIcon from '@material-ui/icons/History'
import ScheduleIcon from '@material-ui/icons/Schedule'
import MailmanLink from '../MailmanLink'

// State Management
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../../reducers/NavDrawer'

const drawerWidth = 240

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  listItem: {
    padding: 0,
  },
  linkContents: {
    display: 'flex',
    width: '100%',
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 16,
    paddingRight: 16,
  },
})

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  }

  render() {
    const { classes, theme } = this.props

    const drawer = (
      <div>
        <ListItem className={classes.listItem} button>
          <MailmanLink
            className={classes.linkContents}
            to="/"
            onClick={this.props.close}
          >
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Templates" />
          </MailmanLink>
        </ListItem>
        <ListItem className={classes.listItem} button>
          <MailmanLink
            className={classes.linkContents}
            to="/"
            onClick={this.props.close}
          >
            <ListItemIcon>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule" />
          </MailmanLink>
        </ListItem>
        <ListItem className={classes.listItem} button>
          <MailmanLink
            className={classes.linkContents}
            to="/"
            onClick={this.props.close}
          >
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
          </MailmanLink>
        </ListItem>
        <ListItem className={classes.listItem} button>
          <MailmanLink
            className={classes.linkContents}
            to="/settings"
            onClick={this.props.close}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MailmanLink>
        </ListItem>
      </div>
    )

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.props.drawerOpen}
            onClose={this.props.close}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return {
    drawerOpen: state.navDrawer.drawerOpened,
  }
}

const withStylesExport = withStyles(styles, { withTheme: true })(
  ResponsiveDrawer
)

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withStylesExport)
