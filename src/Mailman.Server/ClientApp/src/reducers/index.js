import { combineReducers } from 'redux'
import createMergeTemplate from './CreateMergeTemplate'
import loading from './Loading'
import user from './User'
import navDrawer from './NavDrawer'
import readMergeTemplates from './ReadMergeTemplates'
import sheetInfo from './SheetInfo'

export const rootReducer = combineReducers({
  createMergeTemplate,
  loading,
  user,
  navDrawer,
  readMergeTemplates,
  sheetInfo,
})
