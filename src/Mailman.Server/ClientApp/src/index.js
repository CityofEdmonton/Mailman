import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import configureStore from './store/ConfigureStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import theme from './theme'

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState
const store = configureStore(initialState)

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
