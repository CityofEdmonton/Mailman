import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";

import { actionCreators } from "../store/MergeTemplates";
import MergeTemplate from "./MergeTemplate";

const styles = theme => ({});

class Home extends Component {
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
        <p>Placeholder for mergeTemplates</p>
        <div>
          <Grid container spacing={16}>
            {this.props.mergeTemplates.map(mergeTemplate => (
              <Grid key={mergeTemplate.id} item>
                <MergeTemplate
                  title={mergeTemplate.mergeData.title}
                  to={mergeTemplate.mergeData.data.to}
                />
              </Grid>
            ))}
          </Grid>
          <IconButton color="inherit">
            <Link to="/addMergeTemplate">
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

const exportWithStyles = withStyles(styles, { withTheme: true })(Home);

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(exportWithStyles);
