import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Card, Grid, Typography } from '@material-ui/core';

import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest';
import Hint from '../MergeTemplate/Hint';

export default class ReceiverSelection extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
        }
    }

    componentDidMount() {
        this._isMounted = true;

        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const ssid = this.props.spreadsheetId;
        const sheetName = this.props.currentMergeTemplate.sheetName;
        const rowNumber = this.props.currentMergeTemplate.headerRowNumber;

        fetch(`https://localhost:5001/api/Sheets/RowValues/${ssid}/${sheetName}?rowNumber=${rowNumber}`, config)
        .then(response => { // Use arrow functions so do not have to bind to "this" context
            return response.json();
        })
        .then(json => {
            var options = json.filter(columnValue => columnValue.length > 0).map( function(columnValue) {
                return (
                    { label: columnValue }
                );
            });
            this.setState({ selectOptions: options });
        })
        .catch(error => {
            console.log("Unable to get sheet row data. Error: ", error);
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleTextInput = (newInput) => {
        this.setState({ textInput: newInput })
    }

    checkRegex = (result) => {
        this.setState({ regexPassed: result })
    }

    updateMenu = (newInput) => {
        this.setState({ menuInput: newInput })
    }

    handleFormInput = (newInput) => {
        this.setState({ formInput: newInput })
    }

    handleRouting = () => {
        console.log("Handle routing!")
    }

    render() {

        console.log(this.state.selectOptions)

        return (
            <Grid
                container
                style={styles.container}
            >
                <Card style={styles.card}>
                    <Typography variant="h5" style={styles.title}>Who are you sending to?</Typography>
                    <MuiReactAutosuggest
                        placeholder="To..."
                        suggestions={this.state.selectOptions}
                    />
                    <MuiReactAutosuggest
                        placeholder="CC..."
                        suggestions={this.state.selectOptions}
                    />
                    <MuiReactAutosuggest
                        placeholder="BCC..."
                        suggestions={this.state.selectOptions}
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
                <Link to="/mergeTemplate/receiverSelection">
                    <Button
                        color="primary"
                        variant="contained"
                        style={styles.next_button}
                        onClick={() => this.handleRouting()}
                        disabled={!this.state.regexPassed}
                    >
                        Next
                    </Button>
                </Link>
            </Grid>
        );
    }

}

const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 15,
      alignItems: "center",
    },
    card: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
      justifyContent: 'center',
    },
    title: {
      marginBottom: 15
    },
    cancel_button: {
      position: "absolute",
      bottom: 15,
      left: 15
    },
    next_button: {
      position: "absolute",
      bottom: 15,
      right: 15
    },
}

ReceiverSelection.propTypes = {
    currentMergeTemplate: mergeTemplateInfoShape.isRequired,
    spreadsheetId: PropTypes.string.isRequired,
}