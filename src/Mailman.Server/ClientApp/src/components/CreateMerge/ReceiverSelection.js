import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Grid } from '@material-ui/core';

import MergeTemplateInputForm from '../MergeTemplate/MergeTemplateFormCard';
import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

import ReactAutosuggest from '../MergeTemplate/ReactAutosuggest';

export default class ReceiverSelection extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            selectOptions: []
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
            var options = json.filter(x => x.length > 0).map( function(x) {
                return (
                    { value: x }
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

    render() {
        return (
            <Grid
                container
                style={styles.container}
            >
                <ReactAutosuggest
                    suggestions={this.state.selectOptions}
                    regex="<<([^>](2))*"
                    style={{flex: 1}}
                />
                {/* <Link to={`/mergeTemplate/tabSelection`}>
                    <Button
                        variant="contained"
                        style={styles.cancel_button}
                        onClick={() => this.handleRouting()}
                    >
                        Back
                    </Button>
                </Link>
                <Link to="/mergeTemplate/headerSelection">
                    <Button
                        color="primary"
                        variant="contained"
                        style={styles.next_button}
                        onClick={() => this.handleRouting()}
                        disabled={!this.state.regexPassed}
                    >
                        Next
                    </Button>
                </Link> */}
            </Grid>
        );
    }

}

const styles = {
    container: {
      paddingTop: 15,
      alignItems: "center",
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