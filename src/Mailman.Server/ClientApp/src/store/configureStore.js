import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import * as Counter from '../reducers/Counter'
import * as WeatherForecasts from '../reducers/WeatherForecasts'
import * as NavDrawer from '../reducers/NavDrawer'
import * as MergeTemplates from '../reducers/ReadMergeTemplates'
import * as Login from '../reducers/Login'
import { currentMergeTemplateReducer } from '../reducers/CreateMergeTemplate'

let store = null

export default function configureStore(initialState) {
  if (store) {
    console.log('Store already exists.')
    return store
  }
  const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    navDrawer: NavDrawer.reducer,
    mergeTemplates: MergeTemplates.reducer,
    currentMergeTemplate: currentMergeTemplateReducer,
    login: Login.reducer
  }

  const middleware = [thunk]

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = []
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (
    isDevelopment &&
    typeof window !== 'undefined' &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension())
  }

  const rootReducer = combineReducers({
    ...reducers
  })

  store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  return store
}
