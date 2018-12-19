import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayIcon from "@material-ui/icons/PlayArrow";
import CreateIcon from "@material-ui/icons/Create";
import ViewIcon from "@material-ui/icons/Visibility";

import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";


const styles = theme => ({
  paper: {
    height: 160,
    width: 230
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
 
});
//maybe have the button section be a seperate comopnent
const InfoCard = props => {
  const { classes } = props;
  return(<div>
    <Paper className={props.classes.paper}>
      <span><h1>{props.title}</h1>
      <MailIcon className={classes.largeIcon} /></span>
      
      <br/>
           
         
    <aside>
    <IconButton> 
       <Link to={`/mergeTemplate/title/${props.id}`}>
            <CreateIcon/>
        </Link>
      </IconButton>
     <IconButton color="error"><DeleteIcon/></IconButton>
     <IconButton><PlayIcon/></IconButton>
     <IconButton><ViewIcon/></IconButton>
      
    </aside>
     
      
    

    </Paper>
  </div>)
  
  }

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(InfoCard);
