import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MuiReactAutosuggest from '../merge-template/MuiReactAutosuggest'
import Hint from '../merge-template/Hint'
import useDebounce from '../../util/UseDebounce'

const styles = theme => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 15,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    justifyContent: 'center',
    overflow: 'visible',
  },
  title: {
    marginBottom: 15,
  },
})

class TemplateRecipient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toRegexPassed: true,
      ccRegexPassed: true,
      bccRegexPassed: true,
    }
    this.handleLoadHeaders = useDebounce(props.handleLoadHeaders, 500)
  }

  checkToRegex = result => {
    this.setState({ toRegexPassed: result })
  }

  checkCcRegex = result => {
    this.setState({ ccRegexPassed: result })
  }

  checkBccRegex = result => {
    this.setState({ bccRegexPassed: result })
  }

  notifyOfData = input => value => {
    this.handleLoadHeaders()
    this.props.handleChange(input)({ target: { value } })
  }

  render() {
    const emailRegex =
      '([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)' // Source: http://regexlib.com/Search.aspx?k=email&AspxAutoDetectCookieSupport=1
    const tagRegex = '<<[^<>]+>>'
    const receiverRegex = `^((${tagRegex})|(${emailRegex}))(,\\s*((${tagRegex})|(${emailRegex})))*$`

    const { headers } = this.props
    // Transform tabs to match autocomplete format
    const headerValues = headers.headers.map(value => {
      return { label: value }
    })

    return (
      <div>
        <Typography variant="h5" style={styles.title}>
          Who are you sending to?
        </Typography>
        <MuiReactAutosuggest
          placeholder="To..."
          suggestions={headerValues}
          callback={this.notifyOfData('emailTemplate.to')}
          value={this.props.to}
          openWrapper="<<"
          closeWrapper=">>"
          constraintRegex={receiverRegex}
          constraintCallback={this.checkToRegex}
          constraintMessage="Must be template tags << >> or emails seperated by commas"
        />
        <MuiReactAutosuggest
          placeholder="CC..."
          suggestions={headerValues}
          callback={this.notifyOfData('emailTemplate.cc')}
          value={this.props.cc}
          openWrapper="<<"
          closeWrapper=">>"
          constraintRegex={receiverRegex}
          constraintCallback={this.checkCcRegex}
          constraintMessage="Must be template tags << >> or emails seperated by commas"
        />
        <MuiReactAutosuggest
          placeholder="BCC..."
          suggestions={headerValues}
          callback={this.notifyOfData('emailTemplate.bcc')}
          value={this.props.bcc}
          openWrapper="<<"
          closeWrapper=">>"
          constraintRegex={receiverRegex}
          constraintCallback={this.checkBccRegex}
          constraintMessage="Must be template tags << >> or emails seperated by commas"
        />
        <Hint title="This is the column filled with the email addresses of the recipients." />
      </div>
    )
  }
}

TemplateRecipient.propTypes = {
  to: PropTypes.string,
  cc: PropTypes.string,
  bcc: PropTypes.string,
  selectOptions: PropTypes.arrayOf(PropTypes.string),
  handleLoadHeaders: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
}

export default withStyles(styles, { withTheme: true })(TemplateRecipient)
