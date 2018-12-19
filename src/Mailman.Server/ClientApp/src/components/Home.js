import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";

// import { actionCreators } from "../store/MergeTemplates";
import InfoCard from "./MergeTemplate/InfoCard";
import {
  fetchMergeTemplatesIfNeeded
} from '../store/MergeTemplates'

const queryString = require('query-string');

const styles = theme => ({});

class Home extends Component {

  constructor(props){
    super(props)
    this.state = {
      mergeTemplates: []
    }

    

  }

  // 
  componentDidMount() {
    
    //const { dispatch } = this.props
    //console.log(this.props);
    const parsed = queryString.parse(this.props.location.search);
    let spreadsheetId = parsed.ssid; //parse query
   // console.log(spreadsheetId);
    const {dispatch} = this.props;
    //const {fetchMergeTemplatesIfNeeded} = this.props;
    spreadsheetId = '1MiRwI8yIQSmnzBXjtFFSHqmU8t5TaOMqcnZG3aszn6o'
    if (spreadsheetId ){
      dispatch(fetchMergeTemplatesIfNeeded(spreadsheetId));
    }
    //'1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY'
    //console.log(test);
 
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
   console.log(this.props);
   console.log(typeof this.props.mergeTemplates);
   console.log('Piano');
    return (
      <div>
        <div>
          <Grid container spacing={16}>
            {this.props.mergeTemplates.map(mergeTemplate => (
              <Grid key={mergeTemplate.id} item xl={12}>
                <InfoCard
                  title={mergeTemplate.title}
                  to='{mergeTemplate.mergeData.data.to}'
                  id = {mergeTemplate.id}
                />
              </Grid>
            ))}
          </Grid>
          <IconButton color="inherit"   iconStyle={{height: 48, width: 48}} >
            <Link to="/mergeTemplate/title">
              <AddIcon />
            </Link>
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mergeTemplates: state.mergeTemplates.mergeTemplates
  };
};

const mapDispatchToProps = dispatch => {
return {
  fetchMergeTemplatesIfNeeded: (spreadSheetId) =>
    dispatch({
      type: 'FETCH_MERGE_TEMPLATES' //spreadsheet??
    })
}

}

const exportWithStyles = withStyles(styles, { withTheme: true })(Home); //do you have to export with styles everywhere?

// export default connect(
//   mapStateToProps,
//   dispatch => bindActionCreators(actionCreators, dispatch) //should we be using bindActionCreators? check back //also should probably 
// )(exportWithStyles);


// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(exportWithStyles);

export default connect(mapStateToProps)(exportWithStyles);