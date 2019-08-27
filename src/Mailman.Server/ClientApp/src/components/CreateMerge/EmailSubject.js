import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Button, Card, Grid, Typography } from '@material-ui/core'

import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes'

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest'
import Hint from '../MergeTemplate/Hint'

export default class EmailSubject extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      selectOptions: [],
      subject: this.props.currentMergeTemplate.emailTemplate.subject,
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

  handleSubjectInput = newInput => {
    this.setState({ subject: newInput })
  }

  handleRouting = () => {
    const oldSubject = this.props.currentMergeTemplate.emailTemplate.subject
    const { subject } = this.state
    if (oldSubject !== subject) {
      console.log('Email subject was changed!')
      this.props.updateEmailSubject(subject)
    } else {
      console.log('Email subject unchanged.')
    }
  }

  render() {
    return (
      <Grid container style={styles.container}>
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.title}>
            What would you like your email subject to be?
          </Typography>
          <Typography variant="body2">Tip: try typing {'<<'}</Typography>
          <MuiReactAutosuggest
            placeholder="Subject..."
            suggestions={this.state.selectOptions}
            callback={this.handleSubjectInput}
            value={this.state.subject}
            openWrapper="<<"
            closeWrapper=">>"
          />
          <Hint
            title="Recipients will see this as the subject line of the email.
                        Type << to see a list of column names.
                        Template tags will be swapped out with the associated values in the Sheet"
          />
        </Card>
        <Link to={`/mergeTemplate/receiverSelection`}>
          <Button
            variant="contained"
            style={styles.cancel_button}
            onClick={() => this.handleRouting()}
          >
            Back
          </Button>
        </Link>
        <Link to="/mergeTemplate/body">
          <Button
            color="primary"
            variant="contained"
            style={styles.next_button}
            onClick={() => this.handleRouting()}
            disabled={!this.state.subject}
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

EmailSubject.propTypes = {
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateEmailSubject: PropTypes.func.isRequired,
  spreadsheetId: PropTypes.string.isRequired,
}
