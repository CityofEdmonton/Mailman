import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import configureStore from '../store/ConfigureStore'

let store = configureStore()
const ProtectedRoute = ({ component: Component, ...rest }) => {
  let state = store.getState()
  return (
    <Route
      {...rest}
      render={props => {
        return Object.keys(state.user.user).length !== 0 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }}
    />
  )
}

export default ProtectedRoute
