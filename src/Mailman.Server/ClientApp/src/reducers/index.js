import { combineReducers } from 'redux'
import createMergeTemplate from './CreateMergeTemplate'
import loading from './Loading'
import login from './Login'
import counter from './Counter'
import navDrawer from './NavDrawer'
import readMergeTemplates from './ReadMergeTemplates'
import weatherForecasts from './WeatherForecasts'

const rootReducer = combineReducers({
  createMergeTemplate,
  loading,
  login,
  counter,
  navDrawer,
  readMergeTemplates,
  weatherForecasts
})

export default rootReducer