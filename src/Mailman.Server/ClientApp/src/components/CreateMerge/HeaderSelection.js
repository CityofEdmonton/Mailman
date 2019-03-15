import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Card, Grid, Typography } from '@material-ui/core';

import TextInput from '../MergeTemplate/TextInput';
import Hint from '../MergeTemplate/Hint';
import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

export default class HeaderSelection extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            headerRowNumber: this.props.currentMergeTemplate.headerRowNumber.toString(),
            regexPassed: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateRowInput = (newInput) => {
        this.setState({ headerRowNumber: newInput });
    }

    checkRegex = (result) => {
        this.setState({ regexPassed: result })
    }

    handleRouting = () => {
        const oldSelection = this.props.currentMergeTemplate.headerRowNumber;
        if (oldSelection !== this.state.headerRowNumber) {
            console.log("Different header was selected");
            if (this._isMounted) {
                this.props.updateHeaderSelection(this.state.headerRowNumber);
            }
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
                <Card style={styles.card}>
                    <Typography variant="h5" style={styles.title}>Which row contains your header titles?</Typography>
                    <TextInput
                        placeholder="Header row..."
                        value={this.state.headerRowNumber}
                        callback={this.updateRowInput}
                        constraintRegex="^[1-9][0-9]*$"
                        constraintCallback={this.checkRegex}
                        constraintMessage="Must be a number greater than 0"
                    />
                    <Hint title="Mailman will use this to swap out template tags." />
                </Card>
                <Link to={`/mergeTemplate/tabSelection`}>
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

HeaderSelection.propTypes = {
    currentMergeTemplate: mergeTemplateInfoShape.isRequired,
    updateHeaderSelection: PropTypes.func.isRequired,
}