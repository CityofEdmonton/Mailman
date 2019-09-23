import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Hint from './Hint'
import Button from '@material-ui/core/Button'
import TableChartIcon from '@material-ui/icons/TableChart'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  root: {
    width: '90%',
  },
  text: {
    marginRight: theme.spacing.unit * 2,
  },
  sheetButton: {
    color: '#2FA464',
    margin: theme.spacing.unit,
    fontSize: 32,
  },
  sheetcontainer: {
    display: 'inline-block',
    margin: theme.spacing.unit,
  },
})

class TemplateDataSource extends Component {
  constructor(props) {
    super(props)
  }

  showSheetPicker() {
    alert('This will help you pick your Google Sheet.')
  }

  render() {
    const { value, classes, handleChange } = this.props

    return (
      <div className={classes.root}>
        <div>
          <Paper elevation={1} className={classes.sheetcontainer}>
            <Button onClick={this.showSheetPicker}>
              <TableChartIcon className={classes.sheetButton} />
              {value}
            </Button>
          </Paper>
          <Hint title="This Google Sheet contains your data." />
        </div>
        <div>
          <TextField
            required
            className={classes.text}
            label="Tab"
            margin="normal"
          />
          <Hint title="This tab must contain all the information you may want to send in an email." />
        </div>
        <div>
          <TextField
            required
            className={classes.text}
            label="Row"
            margin="normal"
          />
          <Hint title="Mailman will use this to swap out template tags." />
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(TemplateDataSource)
