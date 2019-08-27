import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

import { Button, Card, Grid, Typography } from '@material-ui/core';

import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest';
import Hint from '../MergeTemplate/Hint';
import {getOAuthToken} from '../../util/OAuthUtil'

import { getUtcDateString } from './date';

var ID = require('./id');

export default class SavePage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._isMounted = true;

        // const config = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // };

        // const ssid = this.props.spreadsheetId;
        // const sheetName = this.props.currentMergeTemplate.sheetName;
        // const rowNumber = this.props.currentMergeTemplate.headerRowNumber;

        // fetch(`https://localhost:5001/api/Sheets/RowValues/${ssid}/${sheetName}?rowNumber=${rowNumber}`, config)
        // .then(response => { // Use arrow functions so do not have to bind to "this" context
        //     return response.json();
        // })
        // .then(json => {
        //     var options = json.filter(columnValue => columnValue.length > 0).map( function(columnValue) {
        //         return (
        //             { label: columnValue }
        //         );
        //     });
        //     this.setState({ selectOptions: options });
        // })
        // .catch(error => {
        //     console.log("Unable to get sheet row data. Error: ", error);
        // })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    sendPost = () => {


        const data = {
            ...this.props.currentMergeTemplate,
            "id": ID(),
            "createdDateUtc": getUtcDateString(),
        }
        data.type = "Email";

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        getOAuthToken().then(
            accessToken => {
                config.headers.accessToken = accessToken;

                fetch(`https://localhost:5001/api/MergeTemplates/Email`, config)
                    .then(response => {
                        if (response.status === 201) {
                            return this.props.currentMergeTemplate.spreadsheetId;
                        }
                    })
                    .then(json => {
                        console.log(json);
                    })
                    .catch(error => {
                        console.log("Unable to send post request. Error: ", error);
                    })
            })
    }

    sendPut() {

    }

    handleSave = () => {
        const { id } = this.props.currentMergeTemplate;
        if (id === "") {
            this.sendPost()
        } else {
            this.sendPost()
        }
    }

    render() {
        const theme = createMuiTheme({
            palette: {
              primary: teal,
            },
            typography: {
              useNextVariants: true,
            },
        });

        return (
            <Grid
                container
                style={styles.container}
            >
                <Card style={styles.card}>
                    <Typography variant="h5" style={styles.title}>Save</Typography>
                    <Typography variant="body2" style={styles.text}>This will save the merge. It won't send any emails yet.</Typography>
                    <Typography variant="body2" style={styles.text}>If you would like to send yourself a test email, select the option from the lower right.</Typography>
                </Card>
                <Link to={`/mergeTemplate/body`}>
                    <Button
                        variant="contained"
                        style={styles.cancel_button}
                    >
                        Back
                    </Button>
                </Link>
                {/* <Link to="/"> */}
                <MuiThemeProvider theme={theme}>
                    <Link to="/">
                        <Button
                            color="primary"
                            variant="contained"
                            style={styles.save_button}
                            onClick={() => this.handleSave()}
                        >
                            Save
                            </Button>
                     </Link>
                    </MuiThemeProvider>
                {/* </Link> */}
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
      alignItems: 'center'
    },
    card: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
      justifyContent: 'center',
      overflow: 'visible'
    },
    title: {
      marginBottom: 15
    },
    text: {
      marginTop: 15
    },
    cancel_button: {
      position: "absolute",
      bottom: 15,
      left: 15
    },
    save_button: {
      color: "white",
      position: "absolute",
      bottom: 15,
      right: 15
    },
}

SavePage.propTypes = {
    currentMergeTemplate: mergeTemplateInfoShape.isRequired,
}