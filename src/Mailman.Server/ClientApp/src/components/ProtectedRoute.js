import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import configureStore from '../store/ConfigureStore'

let store = configureStore()
const ProtectedRoute = ({ component: Component, ...rest }) => {
  let state = store.getState()
  console.log('Blocking..')
  return (<Route { ...rest } render={(props) => {
    return Object.keys(state.user.user).length !== 0
    ? <Component {...props} />
    : <Redirect to='/login' />
  }}
  />)
}

export default ProtectedRoute