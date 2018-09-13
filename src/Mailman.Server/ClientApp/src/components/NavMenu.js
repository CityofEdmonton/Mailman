import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';

import './NavMenu.css';

export default props => (
  <AppBar position="static">
    <Toolbar>
      <IconButton color="inherit" aria-label="Menu">
        <MailIcon />
      </IconButton>
      <Typography variant="title" color="inherit" style={{ flex:1 }}>
        <Link to="/">
          Mailman
        </Link>
      </Typography>
      <IconButton color="inherit" aria-label="Menu">
        <Link to="/settings">
          <SettingsIcon>
          </SettingsIcon>
        </Link>
      </IconButton>
    </Toolbar>
  </AppBar>
);
