import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MuiReactAutosuggest from '../merge-template/MuiReactAutosuggest'
import Hint from '../merge-template/Hint'
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

class TemplateEmail extends Component {
  constructor(props) {
    super(props)
    this.handleLoadHeaders = useDebounce(props.handleLoadHeaders, 1000)
  }

  notifyOfData = input => value => {
    this.handleLoadHeaders()
    this.props.handleChange(input)({ target: { value } })
  }

  render() {
    const { headers, classes } = this.props
    // Transform tabs to match autocomplete format
    const headerValues = headers.headers.map(value => {
      return { label: value }
    })

    return (
      <div className={classes.root}>
        <div className={classes.textHint}>
          <span className={classes.text}>
            <MuiReactAutosuggest
              placeholder="Subject..."
              suggestions={headerValues}
              callback={this.notifyOfData('emailTemplate.subject')}
              value={this.props.subject}
              loading={headers.loading}
              openWrapper="<<"
              closeWrapper=">>"
            />
          </span>
          <Hint
            title="Recipients will see this as the subject line of the email.
                        Type << to see a list of column names.
                        Template tags will be swapped out with the associated values in the Sheet"
          />
        </div>
        <div className={classes.textHint}>
          <span className={classes.text}>
            <MuiReactAutosuggest
              placeholder="Body..."
              suggestions={headerValues}
              callback={this.notifyOfData('emailTemplate.body')}
              value={this.props.body}
              loading={headers.loading}
              openWrapper="<<"
              closeWrapper=">>"
            />
          </span>
          <Hint
            title="Recipients will see this as the body of the email.
                        Type << to see a list of column names.
                        Template tags will be swapped out with the associated values in the Sheet"
          />
        </div>
      </div>
    )
  }
}

TemplateEmail.propTypes = {
  body: PropTypes.string,
  subject: PropTypes.string,
  headers: PropTypes.object,
  handleLoadHeaders: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(TemplateEmail)
