import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PlayIcon from "@material-ui/icons/PlayArrowTwoTone";
import CreateIcon from "@material-ui/icons/CreateTwoTone";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";


const styles = theme => ({
  paper: {
    height: 160,
    width: 200
  },
  largeIcon: {
    width: 30,
    height: 30,
  },
 
});

const InfoCard = props => (
  <div>
    <Paper className={props.classes.paper}>
      <h1>{props.title}</h1>
      <p>{props.id}</p>
      <MailIcon iconStyle={styles.largeIcon} />
      <br/>
            <Link to={`/mergeTemplate/title/${props.id}`}>
            <CreateIcon/>
            </Link>
         

     <DeleteIcon/>
      <PlayIcon/>
      
    

    </Paper>
  </div>
);

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(InfoCard);
