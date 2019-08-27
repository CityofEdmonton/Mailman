import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Button, Card, Grid, Typography } from '@material-ui/core'

import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes'

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest'
import Hint from '../MergeTemplate/Hint'

export default class EmailBody extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      selectOptions: [],
      body: this.props.currentMergeTemplate.emailTemplate.body,
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

  handleBodyInput = newInput => {
    this.setState({ body: newInput })
  }

  handleRouting = () => {
    const oldBody = this.props.currentMergeTemplate.emailTemplate.body
    const { body } = this.state
    if (oldBody !== body) {
      console.log('Email body was changed!')
      this.props.updateEmailBody(body)
    } else {
      console.log('Email body unchanged.')
    }
  }

  render() {
    return (
      <Grid container style={styles.container}>
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.title}>
            What would you like your email body to be?
          </Typography>
          <Typography variant="body2">Tip: try typing {'<<'}</Typography>
          <MuiReactAutosuggest
            placeholder="Body..."
            suggestions={this.state.selectOptions}
            callback={this.handleBodyInput}
            value={this.state.body}
            openWrapper="<<"
            closeWrapper=">>"
          />
          <Hint
            title="Recipients will see this as the body of the email.
                        Type << to see a list of column names.
                        Template tags will be swapped out with the associated values in the Sheet"
          />
        </Card>
        <Link to={`/mergeTemplate/subject`}>
          <Button
            variant="contained"
            style={styles.cancel_button}
            onClick={() => this.handleRouting()}
          >
            Back
          </Button>
        </Link>
        <Link to="/mergeTemplate/save">
          <Button
            color="primary"
            variant="contained"
            style={styles.next_button}
            onClick={() => this.handleRouting()}
            disabled={!this.state.body}
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

EmailBody.propTypes = {
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateEmailBody: PropTypes.func.isRequired,
  spreadsheetId: PropTypes.string.isRequired,
}
