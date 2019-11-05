import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MailIcon from '@material-ui/icons/Mail'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import InfoCardSidebar from './InfoCardSidebar'

const styles = theme => ({
  paper: {
    height: 160,
    width: 250,
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  text: {
    maxWidth: 120,
  },
  list: {
    paddingTop: 30,
  },
})

const InfoCard = props => {
  const { classes } = props
  return (
    <div>
      <Paper className={classes.paper}>
        <List className={classes.list}>
          <ListItem>
            <MailIcon className={classes.largeIcon} />
            <ListItemText
              primary={
                <Typography variant="h5" className={classes.text} noWrap={true}>
                  {props.title}
                </Typography>
              }
            />
          </ListItem>
          <ListItemSecondaryAction>
            <InfoCardSidebar id={props.id} />
          </ListItemSecondaryAction>
        </List>
      </Paper>
    </div>
  )
}

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default withStyles(styles, { withTheme: true })(InfoCard)
