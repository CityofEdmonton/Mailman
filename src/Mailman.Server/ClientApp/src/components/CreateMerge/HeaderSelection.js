import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Grid } from '@material-ui/core';

import MergeTemplateInputForm from '../MergeTemplate/MergeTemplateFormCard';
import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

export default class HeaderSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headerRowNumber: this.props.currentMergeTemplate.headerRowNumber.toString(),
            regexPassed: true // this.props.currentMergeTemplate.headerRowNumber.match(/^[0-9][0-9]+$/) // Initial check
        }

        this.updateRowInput = this.updateRowInput.bind(this);
        this.checkRegex = this.checkRegex.bind(this);
        this.handleRouting = this.handleRouting.bind(this);
    }

    updateRowInput(newInput) {
        this.setState({ headerRowNumber: newInput });
    }

    checkRegex(result) {
        this.setState({ regexPassed: result })
    }

    handleRouting() {
        const oldSelection = this.props.currentMergeTemplate.headerRowNumber;
        if (oldSelection !== this.state.headerRowNumber) {
            console.log("Different header was selected");
            this.props.updateHeaderSelection(this.state.selectedTab);
        } else {
            console.log("Header selection unchanged.");
        }
    }

    render() {
        return (
            <Grid
                container
                style={styles.container}
            >
                <MergeTemplateInputForm
                    title="Which row contains your header titles?"
                    textInputTitle="Header row..."
                    textInputValue={this.state.headerRowNumber}
                    textInputCallback={this.updateRowInput}
                    textInputConstraintRegex="^[1-9][0-9]*$"
                    textInputConstraintCallback={this.checkRegex}
                    textInputConstraintMessage="Must be a number greater than 0"
                    tip="Mailman will use this to swap out template tags."
                />
                <Link to={`/mergeTemplate/tabSelection`}>
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
                </Link>
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

HeaderSelection.propTypes = {
    currentMergeTemplate: mergeTemplateInfoShape.isRequired,
    updateHeaderSelection: PropTypes.func.isRequired,
}