import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (<Route { ...rest } render={(props) => (
    props.user
    ? <Component {...props} />
    : <Redirect to='/login' />
  )} />)
}

export default connect(mapStateToProps)(ProtectedRoute)