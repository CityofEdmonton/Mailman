import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Button, Grid, Typography } from '@material-ui/core'

const Home = props => (
  <Grid>
    <Typography variant="subtitle1">Settings</Typography>
    <Grid item>
          <Button variant="contained">
            <Link to="/" >
              Back
            </Link>
          </Button>  
        </Grid>
  </Grid>
  // <div>
  //   <h1>Settings</h1>
    
  // </div>
);

export default connect()(Home);
