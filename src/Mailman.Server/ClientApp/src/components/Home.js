import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { Tooltip } from '@material-ui/core'

import InfoCard from './MergeTemplate/InfoCard'
import { fetchMergeTemplatesIfNeeded } from '../actions/readMergeTemplates'
import { isAbsolute } from 'path'
import { loadFromMergeTemplates } from '../actions/createMergeTemplate'

const queryString = require('query-string')

const styles = theme => ({
  largeButton: {
    width: 50,
    height: 50,
  },
  place: {
    position: 'absolute',
    bottom: -500,
  },
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mergeTemplates: [],
    }
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search)
    let spreadsheetId = parsed.ssid //parse query
    const { dispatch } = this.props
    if (spreadsheetId) {
      dispatch(fetchMergeTemplatesIfNeeded(spreadsheetId))
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <div>
          <Grid container spacing={16}>
            {this.props.mergeTemplates.map(mergeTemplate => (
              <Grid key={mergeTemplate.id} item xl={12}>
                <InfoCard
                  title={mergeTemplate.title}
                  to="{mergeTemplate.mergeData.data.to}"
                  id={mergeTemplate.id}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        <div>
          <Link
            to="/mergeTemplate/title"
            onClick={() => this.props.dispatch(loadFromMergeTemplates())}
          >
            <Tooltip title="New Merge Template" placement="top">
              <AddIcon
                className={classes.largeButton}
                style={{ position: 'absolute', bottom: 10, right: 10 }}
                color="error"
              />
            </Tooltip>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mergeTemplates: state.mergeTemplates.mergeTemplates,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMergeTemplatesIfNeeded: spreadSheetId =>
      dispatch(fetchMergeTemplatesIfNeeded(spreadSheetId)),
  }
}
const exportWithStyles = withStyles(styles, { withTheme: true })(Home)

export default connect(mapStateToProps)(exportWithStyles)
