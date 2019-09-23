import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Hint from './Hint'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  root: {
    width: '90%',
  },
  text: {
    marginRight: theme.spacing.unit * 2,
  },
})


class Title extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { value, classes, handleChange } = this.props

    return (
      <div className={classes.root}>
        <Paper square elevation={0}>
          <TextField required className={classes.text} id="template-title" label="Title" margin="normal" onChange={handleChange('title')} value={value}/>
          <Hint title="This title will help you differentiate this merge from others."/>
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Title)