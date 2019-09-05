import React from 'react'
import Grid from '@material-ui/core/Grid'
import ResponsiveNavMenu from './navigation/ResponsiveNavMenu'
import { withStyles } from '@material-ui/core/styles'
import Loading from './Loading'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '64px',
    padding: '0px 16px 0px 16px',
  },
})

const Layout = props => (
  <div>
    <Loading />
    <ResponsiveNavMenu>
      <Grid container className={props.classes.root}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </ResponsiveNavMenu>
  </div>
)

export default withStyles(styles, { withTheme: true })(Layout)
