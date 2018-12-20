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
import Button from '@material-ui/core/Button';
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Tooltip from "@material-ui/core/Tooltip";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  paper: {
    height: 160,
    width: 230
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  text: {
    maxWidth: 120,
  },
  smallIcon : {
    width: 32,
    height: 32,
    padding: 0,
  },
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  list: {
    paddingTop: 30,
  },
  iconList: {
    paddingTop: 20,
  }
});
//maybe have the button section be a seperate comopnent
const InfoCard = props => {
  const { classes } = props;
  return(<div>
    <Paper className={classes.paper}>
    <List  className={classes.list}>
    <List  >
      <ListItem>
      <MailIcon className={classes.largeIcon}/>
        <ListItemText primary={<Typography variant="h5"  className={classes.text}  noWrap={true}>
      {props.title}
      </Typography>}/>
      </ListItem>
    </List>
    <ListItemSecondaryAction className={classes.iconList}>
    <List disablePadding={true}>
    <ListItem className={classes.root}>
      <IconButton className={classes.smallIcon}><Tooltip title="Delete"><DeleteIcon color="primary"/></Tooltip></IconButton>
      </ListItem>
      
      
      <ListItem className={classes.root}>
      <IconButton className={classes.smallIcon}><Tooltip title="Run"><PlayIcon/></Tooltip></IconButton>
      </ListItem>
      <ListItem className={classes.root}>
      <IconButton className={classes.smallIcon}> 
       <Link to={`/mergeTemplate/title/${props.id}`}>
       <Tooltip title="Edit"><CreateIcon/></Tooltip>
        </Link>
      </IconButton>
      </ListItem>
      <ListItem className={classes.root}>
      <IconButton className={classes.smallIcon}><Tooltip title="Preview"><ViewIcon/></Tooltip></IconButton>
      </ListItem>
    
     
     
     

    </List>
    
    </ListItemSecondaryAction>

    </List>

    
       
           
         
    
      
   
     
      
    

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
