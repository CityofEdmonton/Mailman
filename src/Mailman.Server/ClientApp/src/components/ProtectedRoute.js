import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import configureStore from '../store/ConfigureStore'

let store = configureStore()
const ProtectedRoute = ({ component: Component, ...rest }) => {
  let state = store.getState()
  return (<Route { ...rest } render={(props) => {
    return state.login.user
    ? <Component {...props} />
    : <Redirect to='/login' />
  }}
  />)
}

export default ProtectedRoute