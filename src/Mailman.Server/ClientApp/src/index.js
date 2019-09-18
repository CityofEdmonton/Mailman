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
import { fetchMergeTemplatesIfNeeded } from './actions/ReadMergeTemplates'

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState
const store = configureStore(initialState)
// Start our SignalR connection.
store.dispatch(fetchSignalrId()).then(id => {
  return store.dispatch(fetchMe())
}).then(() => {
  // Load our templates.
  const sheetRegEx = /(\?|&)ssid=([^&]+)/g
  let match = sheetRegEx.exec(window.location.href)
  if (match && match.length > 1) {
    const sheetId = match[2]
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
