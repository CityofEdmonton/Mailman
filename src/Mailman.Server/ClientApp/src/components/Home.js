import React, { Component } from 'react'
import { connect } from 'react-redux'
import MailmanLink from './MailmanLink'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import { Tooltip } from '@material-ui/core'
import InfoCard from './merge-template/InfoCard'

const styles = theme => ({
  action: {
    display: 'flex',
    flexFlow: 'row-reverse',
  },
  fab: {
    margin: theme.spacing.unit,
  },
  templates: {
    flex: 1,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
      <div className={classes.root}>
        <div className={classes.templates}>
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
        <div className={classes.action}>
          <MailmanLink to="/mergeTemplate">
            <Tooltip title="New Merge Template" placement="top">
              <Fab color="primary" aria-label="Add" className={classes.fab}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </MailmanLink>
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
