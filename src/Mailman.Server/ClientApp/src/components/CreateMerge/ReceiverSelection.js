import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Grid } from '@material-ui/core';

import MergeTemplateInputForm from '../MergeTemplate/MergeTemplateFormCard';
import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

import MuiReactAutosuggest from '../MergeTemplate/MuiReactAutosuggest';
import TextInput from '../MergeTemplate/TextInput';
import MenuInput from '../MergeTemplate/MenuInput';

export default class ReceiverSelection extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            selectOptions: [],
            textInput: "",
            regexPassed: false,
            menuInput: ""
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

    handleTextInput = (newInput) => {
        this.setState({ textInput: newInput })
    }

    checkRegex = (result) => {
        this.setState({ regexPassed: result })
    }

    updateMenu = (newInput) => {
        this.setState({ menuInput: newInput })
    }

    render() {

        const suggestions = [
            { label: "Afghanistan" },
            { label: "Aland Islands" },
            { label: "Albania" },
            { label: "Algeria" },
            { label: "American Samoa" },
            { label: "Andorra" },
            { label: "Angola" },
            { label: "Anguilla" },
            { label: "Antarctica" },
            { label: "Antigua and Barbuda" },
            { label: "Argentina" },
            { label: "Armenia" },
            { label: "Aruba" },
            { label: "Australia" },
            { label: "Austria" },
            { label: "Azerbaijan" },
            { label: "Bahamas" },
            { label: "Bahrain" },
            { label: "Bangladesh" },
            { label: "Barbados" },
            { label: "Belarus" },
            { label: "Belgium" },
            { label: "Belize" },
            { label: "Benin" },
            { label: "Bermuda" },
            { label: "Bhutan" },
            { label: "Bolivia, Plurinational State of" },
            { label: "Bonaire, Sint Eustatius and Saba" },
            { label: "Bosnia and Herzegovina" },
            { label: "Botswana" },
            { label: "Bouvet Island" },
            { label: "Brazil" },
            { label: "British Indian Ocean Territory" },
            { label: "Brunei Darussalam" }
          ];

        return (
            <Grid
                container
                style={styles.container}
            >
                {/* <ReactAutosuggest
                    suggestions={this.state.selectOptions}
                    regex="<<[^>]*$"
                    placeholder="To..."
                    style={{flex: 1}}
                /> */}
                <MuiReactAutosuggest
                    // suggestions={[
                    //     { label: "Hello!" }
                    // ]}
                    suggestions={suggestions}
                    regex = "<<[^>]*$"
                    placeholder="To..."
                />
                <MuiReactAutosuggest
                    suggestions={suggestions}
                    placeholder="No regex"
                />
                <TextInput
                    placeholder="Header row..."
                    callback={this.handleTextInput}
                    constraintRegex="^[1-9][0-9]*$"
                    constraintCallback={this.checkRegex}
                    constraintMessage="Must be a number greater than 0"
                />
                <MenuInput
                    placeholder="Tab..."
                    selected=""
                    values={["Item 1", "Item 2", "Item 3"]}
                    callback={this.updateMenu}

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
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
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