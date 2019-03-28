import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Button, Grid, Typography } from '@material-ui/core'

const Home = props => (
  <Grid>
    <Typography variant="subtitle1">Settings</Typography>
    <Grid item>
      <Link to="/">
        <Button variant="contained">Back</Button>  
      </Link>
    </Grid>
  </Grid>
  // <div>
  //   <h1>Settings</h1>
    
  // </div>
);

export default connect()(Home);
