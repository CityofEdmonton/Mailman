import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { Button, Grid, } from '@material-ui/core';

import MergeTemplateInputForm from './MergeTemplateFormCard';
import { mergeTemplateArrayShape, mergeTemplateInfoShape } from './MergeTemplatePropTypes';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export default class TitlePage extends Component {

  constructor(props) {
    super(props);
    this.state = { // initialize empty merge title
      mergeTitle: "",
      formInput: false
    };

    this.updateTextInput = this.updateTextInput.bind(this);
    this.updateFormInput = this.updateFormInput.bind(this);
  }

  getMergeTemplateFromID(templateID) { // returns the index of the mergeTemplate (in props) or null if not exist
    if (!this.props.mergeTemplates) {
      return null;
    }
    for (let i = 0; i < this.props.mergeTemplates.length; i++) {
      if (this.props.mergeTemplates[i]["id"] === templateID) {
        return this.props.mergeTemplates[i];
      }
    }
    return null;
  }

  updateTextInput(newInput) {
    this.setState({ mergeTitle: newInput })
  }

  updateFormInput(newInput) {
    this.setState({ formInput: newInput })
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
          textInput="Title..."
          textInputCallback={this.updateTextInput}
          formInput="Use this title as timestamp column name?"
          formInputCallback={this.updateFormInput}
          tip="This title will help you differentiate this merge from others."
        />
        <Link to="/">
          <Button
            variant="contained"
            style={styles.cancel_button}
            onClick={() => this.props.updateTitlePage(this.state.mergeTitle, this.state.formInput)}
          >
            Cancel
          </Button>
        </Link>
        <Link to="/mergeTemplate/tabSelection">
          <Button
            color="primary"
            variant="contained"
            style={styles.next_button}
            onClick={() => this.props.updateTitlePage(this.state.mergeTitle, this.state.formInput)}
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
  mergeTemplates: mergeTemplateArrayShape.isRequired,
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateTitlePage: PropTypes.func.isRequired
}
  