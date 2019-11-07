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
              placeholder="To..."
              suggestions={headerValues}
              callback={this.notifyOfData('emailTemplate.to')}
              value={this.props.to}
              loading={headers.loading}
              openWrapper="<<"
              closeWrapper=">>"
              constraintRegex={receiverRegex}
              constraintCallback={this.checkToRegex}
              constraintMessage="Must be template tags << >> or emails seperated by commas"
            />
          </span>
          <Hint title="Use << to dynamically fill this with email addresses from your spreadsheet. You can also put people's emails in here directly." />
        </div>
        <div className={classes.textHint}>
          <span className={classes.text}>
            <MuiReactAutosuggest
              placeholder="CC..."
              suggestions={headerValues}
              callback={this.notifyOfData('emailTemplate.cc')}
              value={this.props.cc}
              loading={headers.loading}
              openWrapper="<<"
              closeWrapper=">>"
              constraintRegex={receiverRegex}
              constraintCallback={this.checkCcRegex}
              constraintMessage="Must be template tags << >> or emails seperated by commas"
            />
          </span>
          <Hint title="CC stands for carbon copy. When you list the email address in the CC header, that recipient will receive a copy of the message." />
        </div>
        <div className={classes.textHint}>
          <span className={classes.text}>
            <MuiReactAutosuggest
              placeholder="BCC..."
              suggestions={headerValues}
              callback={this.notifyOfData('emailTemplate.bcc')}
              value={this.props.bcc}
              loading={headers.loading}
              openWrapper="<<"
              closeWrapper=">>"
              constraintRegex={receiverRegex}
              constraintCallback={this.checkBccRegex}
              constraintMessage="Must be template tags << >> or emails seperated by commas"
            />
          </span>
          <Hint title="BCC stands for blind carbon copy which is similar to that of CC except that the email address of the recipients specified in this field do not appear in the received message header and the recipients in the to or CC fields will not know that a copy was sent to these addresses." />
        </div>
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
