import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import HelpIcon from '@material-ui/icons/Help'
import { Tooltip } from '@material-ui/core'

const styles = theme => ({
  // https://material-ui.com/demos/tooltips/#variable-width - change width
  customTooltip: {
    fontSize: 14,
    font: 'Roboto',
    maxWidth: 200,
    padding: 15,
  },
})

function Hint({ classes, title }) {
  return (
    <Tooltip
      title={title}
      style={{ marginTop: 50 }}
      classes={{ tooltip: classes.customTooltip }}
    >
      <HelpIcon />
    </Tooltip>
  )
}

Hint.propTypes = {
  title: PropTypes.string.isRequired,
}

export default withStyles(styles)(Hint)
