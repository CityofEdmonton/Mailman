import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";


// import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// import { actionCreators } from '../../store/MergeTemplates';

class TitlePage extends Component {
  componentWillMount() {
    // This method runs when the component is first added to the page
    //const sheetId = ""; // TODO: get sheetId 
  //  this.props.requestMergeTemplates(sheetId);
  }

  componentWillReceiveProps(nextProps) {
    // This method runs when incoming props (e.g., route params) change
    //const sheetId = ""; // TODO: get sheetId 
    //this.props.requestMergeTemplates(sheetId);
  }

  render() {
    console.log(this.props); //what we could do is get the id from the path... or do something else??
    return (
      <div>
        <Paper>
        <h4>What should this merge template be called?</h4>
        <p>Here you can add a new MergeTemplate.  This will be a sequence of cards.</p>
        <input type="text"></input><br></br>
        <input type="checkbox"/> Use this title as timestamp column name?<br></br>
        <Tooltip title="This title will help you differentiate this merge from others."><HelpIcon/></Tooltip>
        </Paper>
        <div>
          <Button variant="contained">
              Back 
          </Button>  
          <Button color="primary" variant="contained">
              Next
          </Button>
        </div>
      </div>
    );
  }
}



// export default connect(
//   state => state.mergeTemplates,
//   dispatch => bindActionCreators(actionCreators, dispatch)
// )(TitlePage);


const mapDispatchToProps = dispatch => {
  return {
    fetchMergeTemplatesIfNeeded: () =>
      dispatch({
        type: 'FETCH_MERGE_TEMPLATES'
      })
  }
  
  }

  // function  mapStateToProps(state) {
  //   return {

  //   }
  // }

  export default connect(
    state => state.mergeTemplates,
    mapDispatchToProps
  )(TitlePage); //Styles??
  