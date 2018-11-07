import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { actionCreators } from '../store/MergeTemplates';

class AddMergeTemplate extends Component {
  componentWillMount() {
    // This method runs when the component is first added to the page
    //const sheetId = ""; // TODO: get sheetId 
   //this.props.requestMergeTemplates(sheetId);
  }

  componentWillReceiveProps(nextProps) {
    // This method runs when incoming props (e.g., route params) change
    //const sheetId = ""; // TODO: get sheetId 
    //this.props.requestMergeTemplates(sheetId);
  }

  render() {
    return (
      <div>
        <p>Here you can add a new MergeTemplate.  This will be a sequence of cards.</p>
        <div>
          <Button variant="contained">
              Back
          </Button>
          <Button color="primary" variant="contained">
              Save
          </Button>
        </div>
      </div>
    );
  }
}



export default connect(
  state => state.mergeTemplates,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AddMergeTemplate);
