import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Checkbox, FormControlLabel, Typography } from '@material-ui/core'

export default class FormInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
    }
  }

  componentDidMount() {
    this.props.callback(this.state.value)
  }

  handleFormInput = () => {
    var currentValue = this.state.value
    this.setState({
      value: !currentValue,
    })
    if (this.props.callback) {
      this.props.callback(!currentValue)
    }
  }

  render() {
    return (
      <FormControlLabel
        name="form_input"
        control={
          <Checkbox
            color="primary"
            style={styles.formInputCheckbox}
            checked={this.state.value}
            onChange={this.handleFormInput}
          />
        }
        label={<Typography variant="caption">{this.props.title}</Typography>}
        labelPlacement="end"
        style={styles.formInput}
      />
    )
  }
}

const styles = {
  formInput: {
    marginTop: 15,
  },
  formInputCheckbox: {
    position: 'relative',
    top: 0,
  },
}

FormInput.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.bool,
  callback: PropTypes.func.isRequired,
}
