import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Hint from './Hint'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  root: {
    width: '90%',
  },
  text: {
    marginRight: theme.spacing.unit * 2,
  },
  textHint: {
    display: 'flex',
  },
})

class Title extends Component {
  render() {
    const { value, classes, handleChange } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.textHint}>
          <TextField
            required
            className={classes.text}
            id="template-title"
            label="Title"
            margin="normal"
            onChange={handleChange('title')}
            value={value}
          />
          <Hint title="This title will help you differentiate this merge from others." />
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Title)
