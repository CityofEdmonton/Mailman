import { combineReducers } from 'redux'
import createMergeTemplate from './CreateMergeTemplate'
import loading from './Loading'
import user from './User'
import counter from './Counter'
import navDrawer from './NavDrawer'
import readMergeTemplates from './ReadMergeTemplates'
import weatherForecasts from './WeatherForecasts'

export const rootReducer = combineReducers({
  createMergeTemplate,
  loading,
  user,
  counter,
  navDrawer,
  readMergeTemplates,
  weatherForecasts,
})
