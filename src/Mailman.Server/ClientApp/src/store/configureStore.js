import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer } from '../reducers'
import * as actionCreators from '../actions'

let store = null

export default function configureStore() {
  if (store) {
    console.log('Store already exists.')
    return store
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators, serialize: true, trace: true }) || compose;

  const middleware = [thunk]
  const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
  );

  store = createStore(
    rootReducer,
    enhancer
  )
  return store
}
