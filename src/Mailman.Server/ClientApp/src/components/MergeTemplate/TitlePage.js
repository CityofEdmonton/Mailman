import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { Button, Grid, } from '@material-ui/core';

import MergeTemplateInputForm from './MergeTemplateFormCard';
import { mergeTemplateInfoShape } from './MergeTemplatePropTypes';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export default class TitlePage extends Component {

  constructor(props) {
    super(props);
    this.state = { // initialize empty merge title inputs
      mergeTitle: this.props.currentMergeTemplate.title,
      formInput: this.props.currentMergeTemplate.timestampColumn.shouldPrefixNameWithMergeTemplateTitle
    };

    this.updateTextInput = this.updateTextInput.bind(this);
    this.updateFormInput = this.updateFormInput.bind(this);
    this.handleRouting = this.handleRouting.bind(this);
  }

  updateTextInput(newInput) {
    this.setState({ mergeTitle: newInput })
  }

  updateFormInput(newInput) {
    this.setState({ formInput: newInput })
  }

  handleRouting() {
    const oldTitle = this.props.currentMergeTemplate.title;
    const oldTimestamp = this.props.currentMergeTemplate.timestampColumn.shouldPrefixNameWithMergeTemplateTitle;
    if (oldTitle !== this.state.mergeTitle || oldTimestamp !== this.state.formInput) {
      console.log("Title page was changed. Should update!")
      this.props.updateTitlePage(this.state.mergeTitle, this.state.formInput)
    } else {
      console.log("Title page unchanged.")
    }
  }

  render() {

    return (
      <Grid
        container
        style={styles.container}
      >
        <MergeTemplateInputForm
          title="What should this merge template be called?"
          mergeTemplateInfo={this.props.currentMergeTemplate}
          textInputTitle="Title..."
          textInputValue={this.state.mergeTitle}
          textInputCallback={this.updateTextInput}
          formInputTitle="Use this title as timestamp column name?"
          formInputValue={this.state.formInput}
          formInputCallback={this.updateFormInput}
          tip="This title will help you differentiate this merge from others."
        />
        <Link to="/">
          <Button
            variant="contained"
            style={styles.cancel_button}
          >
            Cancel
          </Button>
        </Link>
        <Link to="/mergeTemplate/tabSelection">
          <Button
            color="primary"
            variant="contained"
            style={styles.next_button}
            onClick={() => this.handleRouting()}
            disabled={!this.state.mergeTitle}>
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
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    justifyContent: "center",
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
  }
}

TitlePage.propTypes = {
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateTitlePage: PropTypes.func.isRequired
}
  