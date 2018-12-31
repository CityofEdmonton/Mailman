import React from "react";
import { withStyles } from "@material-ui/core/styles";

import DeleteIcon from "@material-ui/icons/Delete";
import PlayIcon from "@material-ui/icons/PlayArrow";
import CreateIcon from "@material-ui/icons/Create";
import ViewIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';



const styles = theme => ({
    
    smallIcon : {
      width: 32,
      height: 32,
      padding: 0,
    },
    root: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    iconList: {
      paddingTop: 50,
    }
  });


const InfoCardSidebar = props => {
    const { classes } = props;
  return(<div>
    
    <List disablePadding={true} className={classes.iconList}>
      
      <ListItem className={classes.root}>
        <IconButton className={classes.smallIcon}>
          <Tooltip title="Delete" placement="left"><DeleteIcon style={{color: "red"}}/></Tooltip>
        </IconButton>
      </ListItem>
      <ListItem className={classes.root}>
        <IconButton className={classes.smallIcon}>
          <Tooltip title="Run" placement="left"><PlayIcon style={{color: "green"}}/></Tooltip>
        </IconButton>
      </ListItem>
      <ListItem className={classes.root}>
        <IconButton className={classes.smallIcon} > 
          <Link to={`/mergeTemplate/title/${props.id}`}>
            <Tooltip title="Edit" placement="left"><CreateIcon style={{color: "grey"}}/></Tooltip>
          </Link>
        </IconButton>
      </ListItem>
      <ListItem className={classes.root}>
        <IconButton className={classes.smallIcon}>
          <Tooltip title="Preview" placement="left"><ViewIcon style={{color: "black"}}/></Tooltip>
        </IconButton>
      </ListItem>
    
    </List>
    
    </div>)
    
}

export default withStyles(styles, { withTheme: true })(InfoCardSidebar);
