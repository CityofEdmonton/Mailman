import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import { Tooltip } from '@material-ui/core'

import InfoCard from './merge-template/InfoCard'
import { loadFromMergeTemplates } from '../actions/CreateMergeTemplate'

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

const exportWithStyles = withStyles(styles, { withTheme: true })(Home)

export default connect(mapStateToProps)(exportWithStyles)
