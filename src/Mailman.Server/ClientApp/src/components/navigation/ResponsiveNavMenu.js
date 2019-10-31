import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ResponsiveDrawer from './Drawer'
import SettingsIcon from '@material-ui/icons/Settings'
import LetterIcon from '@material-ui/icons/Drafts'
import { Link } from 'react-router-dom'

// State Management
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../../reducers/NavDrawer'

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 800,
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
})

class ResponsiveNavMenu extends React.Component {
  render() {
    const { classes } = this.props
    console.log(`State: ${this.props}`)

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <LetterIcon style={{ paddingRight: 5 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Mailman
            </Typography>
            <Link to="/settings">
              <IconButton>
                <SettingsIcon style={{ color: 'white' }} />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    )
  }
}

ResponsiveNavMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  return {
    drawerOpen: state.navDrawer.drawerOpened,
  }
}

const exportWithStyles = withStyles(styles, { withTheme: true })(
  ResponsiveNavMenu
)

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(exportWithStyles)
