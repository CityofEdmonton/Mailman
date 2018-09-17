import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({});

const MergeTemplate = props => (
  <div>
    <Grid item>
      <h1>{props.title}</h1>
    </Grid>
  </div>
);

MergeTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(MergeTemplate);
