import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { Button, Grid } from '@material-ui/core';

import MergeTemplateInputForm from './MergeTemplateFormCard';
import { mergeTemplateInfoShape } from './MergeTemplatePropTypes';

export default class TabSelection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: this.props.currentMergeTemplate.sheetName
        }

        // should pass in "mergeTemplateInfo" from container component
    }

    render() {

        return (
            <Grid
                container
                style={styles.container}
            >
                <MergeTemplateInputForm
                    title="Which tab are we sending from?"
                    mergeTemplateInfo={this.props.currentMergeTemplate}
                    menuInput={["Hello!"]}
                    tip="This tab must contain all the information you may want to send in an email."
                />
                <Link to={`/mergeTemplate/title`}> {/* This props id should be in store -> under current mergeTemplate -> can query from store -> using TabSelectionContainer*/}
                    <Button
                        variant="contained"
                        style={styles.cancel_button}
                    >
                        Back
                    </Button>
                </Link>
                <Link to="/mergeTemplate/tabSelection">
                    <Button
                        color="primary"
                        variant="contained"
                        style={styles.next_button}
                        onClick={() => console.log("State: ", this.state)} // TODO: call dispatch (matchDispatchToProps) to update mergeTemplateInfo
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

TabSelection.propTypes = {
    currentMergeTemplate: mergeTemplateInfoShape.isRequired
}