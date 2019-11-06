import React from 'react'
import { connect } from 'react-redux'
import MailmanLink from './MailmanLink'
import { Button, Grid, Typography } from '@material-ui/core'

const Home = props => (
  <Grid>
    <Typography variant="subtitle1">Settings</Typography>
    <Grid item>
      <MailmanLink to="/">
        <Button variant="contained">Back</Button>
      </MailmanLink>
    </Grid>
  </Grid>
)

export default connect()(Home)
