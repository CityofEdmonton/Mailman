import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Button, Card, Grid, Typography } from '@material-ui/core'

import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes'

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest'
import Hint from '../MergeTemplate/Hint'

export default class ReceiverSelection extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      selectOptions: [],
      sendTo: this.props.currentMergeTemplate.emailTemplate.to,
      sendCc: this.props.currentMergeTemplate.emailTemplate.cc,
      sendBcc: this.props.currentMergeTemplate.emailTemplate.bcc,
      toRegexPassed: true,
      ccRegexPassed: true,
      bccRegexPassed: true,
    }
  }

  componentDidMount() {
    this._isMounted = true

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const ssid = this.props.spreadsheetId
    const sheetName = this.props.currentMergeTemplate.sheetName
    const rowNumber = this.props.currentMergeTemplate.headerRowNumber

    fetch(
      `https://localhost:5001/api/Sheets/RowValues/${ssid}/${sheetName}?rowNumber=${rowNumber}`,
      config
    )
      .then(response => {
        // Use arrow functions so do not have to bind to "this" context
        return response.json()
      })
      .then(json => {
        var options = json
          .filter(columnValue => columnValue.length > 0)
          .map(function(columnValue) {
            return { label: columnValue }
          })
        if (this._isMounted) {
          this.setState({ selectOptions: options })
        }
      })
      .catch(error => {
        console.log('Unable to get sheet row data. Error: ', error)
      })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  handleToInput = newInput => {
    this.setState({ sendTo: newInput })
  }

  handleCcInput = newInput => {
    this.setState({ sendCc: newInput })
  }

  handleBccInput = newInput => {
    this.setState({ sendBcc: newInput })
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

  handleRouting = () => {
    const oldTo = this.props.currentMergeTemplate.emailTemplate.to
    const oldCc = this.props.currentMergeTemplate.emailTemplate.cc
    const oldBcc = this.props.currentMergeTemplate.emailTemplate.bcc
    const { sendTo, sendCc, sendBcc } = this.state
    if (oldTo !== sendTo || oldCc !== sendCc || oldBcc !== sendBcc) {
      console.log('Receiver selection was changed!')
      this.props.updateReceiverSelection(sendTo, sendCc, sendBcc)
    } else {
      console.log('Receiver selection unchanged.')
    }
  }

  render() {
    const emailRegex =
      '([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)' // Source: http://regexlib.com/Search.aspx?k=email&AspxAutoDetectCookieSupport=1
    const tagRegex = '<<[^<>]+>>'
    const receiverRegex = `^((${tagRegex})|(${emailRegex}))(,\\s*((${tagRegex})|(${emailRegex})))*$`

    return (
      <Grid container style={styles.container}>
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.title}>
            Who are you sending to?
          </Typography>
          <MuiReactAutosuggest
            placeholder="To..."
            suggestions={this.state.selectOptions}
            callback={this.handleToInput}
            value={this.state.sendTo}
            openWrapper="<<"
            closeWrapper=">>"
            constraintRegex={receiverRegex}
            constraintCallback={this.checkToRegex}
            constraintMessage="Must be template tags << >> or emails seperated by commas"
          />
          <MuiReactAutosuggest
            placeholder="CC..."
            suggestions={this.state.selectOptions}
            callback={this.handleCcInput}
            value={this.state.sendCc}
            openWrapper="<<"
            closeWrapper=">>"
            constraintRegex={receiverRegex}
            constraintCallback={this.checkCcRegex}
            constraintMessage="Must be template tags << >> or emails seperated by commas"
          />
          <MuiReactAutosuggest
            placeholder="BCC..."
            suggestions={this.state.selectOptions}
            callback={this.handleBccInput}
            value={this.state.sendBcc}
            openWrapper="<<"
            closeWrapper=">>"
            constraintRegex={receiverRegex}
            constraintCallback={this.checkBccRegex}
            constraintMessage="Must be template tags << >> or emails seperated by commas"
          />
          <Hint title="This is the column filled with the email addresses of the recipients." />
        </Card>
        <Link to={`/mergeTemplate/headerSelection`}>
          <Button
            variant="contained"
            style={styles.cancel_button}
            onClick={() => this.handleRouting()}
          >
            Back
          </Button>
        </Link>
        <Link to="/mergeTemplate/subject">
          <Button
            color="primary"
            variant="contained"
            style={styles.next_button}
            onClick={() => this.handleRouting()}
            disabled={
              !this.state.toRegexPassed ||
              (Boolean(this.state.sendCc) && !this.state.ccRegexPassed) ||
              (Boolean(this.state.sendBcc) && !this.state.bccRegexPassed)
            }
          >
            Next
          </Button>
        </Link>
      </Grid>
    )
  }
}

const styles = {
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
  cancel_button: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  next_button: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
}

ReceiverSelection.propTypes = {
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateReceiverSelection: PropTypes.func.isRequired,
  spreadsheetId: PropTypes.string.isRequired,
}
