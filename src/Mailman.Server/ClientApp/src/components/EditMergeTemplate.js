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

import InfoCard from './merge-template/InfoCard'
import { fetchMergeTemplatesIfNeeded } from '../actions/ReadMergeTemplates'
import { isAbsolute } from 'path'
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

class EditMergeTemplateInner extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { template } = this.props

    let form
    if (template) {
      form = <p>Edit Merge Templates for {template.id}</p>
    }
    return (
      <div>
        {form}
      </div>
    )
  }
}
export const EditMergeTemplate = withStyles(styles, { withTheme: true })(EditMergeTemplateInner)


class EditMergeTemplateByIdInner extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <EditMergeTemplate template={this.props.template}/>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id

  return {
    template: state.readMergeTemplates.mergeTemplates.find(el => {
      return el.id === id
    })
  }
}

export const EditMergeTemplateById = connect(mapStateToProps)(EditMergeTemplateByIdInner)
