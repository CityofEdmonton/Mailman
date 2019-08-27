import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

export default class MenuInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected || '',
    }
  }

  handleMenuInput = event => {
    var currentSelection = event.target.value
    this.setState({
      selected: currentSelection,
    })
    if (this.props.callback) {
      this.props.callback(currentSelection)
    }
  }

  createMenuItems() {
    return this.props.values.map(function(tab) {
      return (
        <MenuItem key={tab} value={tab}>
          {tab}
        </MenuItem>
      )
    })
  }

  render() {
    return (
      <FormControl name="menu_input">
        {this.state.selected ? null : (
          <InputLabel>{this.props.placeholder}</InputLabel>
        )}
        <Select
          style={styles.menuInput}
          value={this.state.selected}
          onChange={this.handleMenuInput}
        >
          {this.createMenuItems()}
        </Select>
      </FormControl>
    )
  }
}

const styles = {
  menuInput: {
    marginTop: 15,
  },
}

MenuInput.propTypes = {
  placeholder: PropTypes.string,
  selected: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
}
