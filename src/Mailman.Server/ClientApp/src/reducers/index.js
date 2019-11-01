import { combineReducers } from 'redux'
import loading from './Loading'
import user from './User'
import navDrawer from './NavDrawer'
import mergeTemplates from './MergeTemplates'
import sheetInfo from './SheetInfo'

export const rootReducer = combineReducers({
  loading,
  user,
  navDrawer,
  mergeTemplates,
  sheetInfo,
})
