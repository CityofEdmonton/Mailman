import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import configureStore from './store/ConfigureStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import theme from './theme'
import { fetchMe } from './actions/User'
import { fetchSignalrId } from './actions/Signalr'
import { fetchMergeTemplatesIfNeeded } from './actions/MergeTemplates'
import { getHashParams } from './util/QueryParam'

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState
const store = configureStore(initialState)
// Start our SignalR connection.
store
  .dispatch(fetchSignalrId())
  .then(id => {
    return store.dispatch(fetchMe())
  })
  .then(() => {
    // Load our templates.
    let params = getHashParams(window.location.href)
    if (params['ssid']) {
      const sheetId = params['ssid']
      return store.dispatch(fetchMergeTemplatesIfNeeded(sheetId))
    }
  })

const rootElement = document.getElementById('root')

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  rootElement
)

registerServiceWorker()
