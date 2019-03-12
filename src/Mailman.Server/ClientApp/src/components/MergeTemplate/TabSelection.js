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

        this.handleRouting = this.handleRouting.bind(this);
        // should pass in "mergeTemplateInfo" from container component
    }

    handleRouting() {
        // Look at TitlePage -> check if state was changed
        console.log("TODO: update Tab Selection")
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
                    menuInput={true}
                    menuInputSelected="Hello!" // this is required!
                    menuInputValues={["Hello!"]}
                    tip="This tab must contain all the information you may want to send in an email."
                />
                <Link to={`/mergeTemplate/title`}>
                    <Button
                        variant="contained"
                        style={styles.cancel_button}
                        onClick={() => this.handleRouting()}
                    >
                        Back
                    </Button>
                </Link>
                <Link to="/mergeTemplate/tabSelection">
                    <Button
                        color="primary"
                        variant="contained"
                        style={styles.next_button}
                        // onClick={() => console.log("State: ", this.state)} // TODO: call dispatch (matchDispatchToProps) to update mergeTemplateInfo
                        onClick={() => this.handleRouting()}
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