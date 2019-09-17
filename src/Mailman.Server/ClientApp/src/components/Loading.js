import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  fullPage: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: '100',
    background: 'blue',
  },
  hidden: {
    display: 'none',
  }
})

const Loading = (props) => {
  let loadClass = props.classes.hidden
  if (props.loading.length > 0) {
    loadClass = props.classes.fullPage
  }
  return <div className={loadClass}>
    <h1>Loading</h1>

    <p>This is a loading page</p>
    <p>{props.loading[0]}</p>
  </div>
}

const mapStateToProps = state => {
  return {
    loading: state.loading
  }
}

const exportWithStyles = withStyles(styles, { withTheme: true })(Loading)

export default connect(mapStateToProps)(exportWithStyles)