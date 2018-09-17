import React from 'react';
import Grid from '@material-ui/core/Grid';
import ResponsiveNavMenu from './navigation/ResponsiveNavMenu'
import ResponsiveDrawer from './navigation/Drawer'

export default props => (
  <div>
    <ResponsiveDrawer />
    <ResponsiveNavMenu>
      <Grid container spacing={24}>
        <Grid item>
          {props.children}
        </Grid>
      </Grid>
    </ResponsiveNavMenu>
  </div>
);
