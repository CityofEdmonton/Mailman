import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  paper: {
    height: 140,
    width: 100
  }
});

const MergeTemplate = props => (
  <div>
    <Paper className={props.classes.paper}>
      <p>{props.title}</p>
    </Paper>
  </div>
);

MergeTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(MergeTemplate);
