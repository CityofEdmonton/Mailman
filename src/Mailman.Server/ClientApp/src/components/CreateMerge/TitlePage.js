import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { Button, Card, Grid, Typography } from '@material-ui/core';

import TextInput from '../MergeTemplate/TextInput';
import FormInput from '../MergeTemplate/FormInput';
import Hint from '../MergeTemplate/Hint';
import { mergeTemplateInfoShape } from '../MergeTemplate/MergeTemplatePropTypes';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export default class TitlePage extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { // initialize empty merge title inputs
      mergeTitle: this.props.currentMergeTemplate.title,
      formInput: this.props.currentMergeTemplate.timestampColumn.shouldPrefixNameWithMergeTemplateTitle
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateTextInput = (newInput) => {
    this.setState({ mergeTitle: newInput })
  }

  updateFormInput = (newInput) => {
    this.setState({ formInput: newInput })
  }

  handleRouting = () => {
    const oldTitle = this.props.currentMergeTemplate.title;
    const oldTimestamp = this.props.currentMergeTemplate.timestampColumn.shouldPrefixNameWithMergeTemplateTitle;
    if (oldTitle !== this.state.mergeTitle || oldTimestamp !== this.state.formInput) {
      console.log("Title page was changed. Should update!");
      if (this._isMounted) {
        this.props.updateTitlePage(this.state.mergeTitle, this.state.formInput);
      }
    } else {
      console.log("Title page unchanged.");
    }
  }

  render() {

    return (
      <Grid
        container
        style={styles.container}
      >
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.title}>What should this merge template be called?</Typography>
          <TextInput
            placeholder="Title..."
            value={this.state.mergeTitle}
            callback={this.updateTextInput}
          />
          <FormInput
            title="Use this title as timestamp column name?"
            value={this.state.formInput}
            callback={this.updateFormInput}
          />
          <Hint title="This title will help you differentiate this merge from others." />
        </Card>
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
  }
}

TitlePage.propTypes = {
  currentMergeTemplate: mergeTemplateInfoShape.isRequired,
  updateTitlePage: PropTypes.func.isRequired
}
  