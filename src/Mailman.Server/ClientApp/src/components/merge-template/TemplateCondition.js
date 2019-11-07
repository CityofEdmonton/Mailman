import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Hint from './Hint'
import MuiReactAutosuggest from '../merge-template/MuiReactAutosuggest'
import useDebounce from '../../util/UseDebounce'

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

class TemplateCondition extends Component {
  constructor(props) {
    super(props)

    this.handleLoadHeaders = useDebounce(props.handleLoadHeaders, 500)

    this.state = {
      checked: props.conditional != null && props.conditional !== '',
    }
  }

  onConditionChange = newValue => {
    this.handleLoadHeaders()
    this.props.handleChange('conditional')({ target: { value: newValue } })
  }

  onChecked = () => {
    if (this.state.checked) {
      this.props.handleChange('conditional')({ target: { value: '' } })
    }
    this.setState({
      checked: !this.state.checked,
    })
  }

  render() {
    const { classes, headers } = this.props

    // Transform headerts to match autocomplete format
    const headerValues = headers.headers.map(value => {
      return { label: value }
    })

    return (
      <div className={classes.root}>
        <div className={classes.textHint}>
          <span className={classes.text}>
            <MuiReactAutosuggest
              placeholder="Conditional..."
              suggestions={headerValues}
              callback={this.onConditionChange}
              value={this.props.conditional}
              loading={headers.loading}
              disabled={!this.state.checked}
              openWrapper="<<"
              closeWrapper=">>"
            />
          </span>
          <Hint title="This column is used to determine when to send an email. If a given row reads TRUE, Mailman will send an email. Any other value and Mailman won't send. This can be useful for scheduling your merges or ensuring you don't accidentally email someone twice." />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checked}
                onChange={this.onChecked}
                value="checked"
                color="primary"
              />
            }
            label="Use conditional sending?"
          />
        </div>
      </div>
    )
  }
}

TemplateCondition.propTypes = {
  conditional: PropTypes.string,
  headers: PropTypes.shape({
    loading: PropTypes.bool,
    headers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleLoadHeaders: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(TemplateCondition)
