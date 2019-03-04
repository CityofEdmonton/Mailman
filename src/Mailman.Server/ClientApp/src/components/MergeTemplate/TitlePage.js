import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

// import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// import { actionCreators } from '../../store/MergeTemplates';

class TitlePage extends Component {
  componentWillMount() {
    // This method runs when the component is first added to the page
    // const sheetId = ""; // TODO: get sheetId 
    // this.props.requestMergeTemplates(sheetId);
  }

  componentWillReceiveProps(nextProps) {
    // This method runs when incoming props (e.g., route params) change
    // const sheetId = ""; // TODO: get sheetId 
    // this.props.requestMergeTemplates(sheetId);
  }

  render() {
    console.log('Hello!' + this.props); //what we could do is get the id from the path... or do something else??
    return (
      // <div>
      <Grid
        container
        alignItems="center"
      >
        <Grid item>
          <Paper style={{ padding: 9 }}>
            <Typography variant="h5" gutterBottom>What should this merge template be called?</Typography>
            {/* <Typography gutterBottom style={{paddingBottom: 10}}>Here you can add a new MergeTemplate.  This will be a sequence of cards.</Typography> */}
            {/* <p>Here you can add a new MergeTemplate.  This will be a sequence of cards.</p> */}
            {/* <input type="text"></input><br></br> */}
            <Input placeholder="Title" style={{width: "wrap-content", alignText: "center"}}/>
            <FormControlLabel
              control={ <Checkbox color="primary" /> }
              label={ <Typography variant="subtitle2">Use this title as timestamp column name?</Typography> }
              labelPlacement="end"
              style={{paddingTop: 10}}
            />
            {/* <input type="checkbox"/> Use this title as timestamp column name?<br></br> */}
            <Tooltip title="This title will help you differentiate this merge from others." style={{paddingTop: 10}}><HelpIcon/></Tooltip>
          </Paper>
        </Grid>
        {/* <div> */}
        <Grid item>
          <Button variant="contained">
            <Link to="/" >
              Cancel
            </Link>
          </Button>  
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained" disabled={true}>
              Next
          </Button>
        </Grid>
        {/* </div> */}
      </Grid>
      // {/* </div> */}
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
  