import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { store } from './app/store'
import { Provider as ReduxProvider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import { Auth0Provider } from "./react-auth0-spa"
import config from "./auth_config.json"
import history from "./utilities/history"
import { createClient, Provider as UrlQlProvider } from 'urql'
import './index.css'

const client = createClient({
  url: 'http://localhost:3000/graphql',
})


// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
  history.push(
    (appState && appState.targetUrl) || window.location.pathname
  )
}

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    audience={config.audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <ReduxProvider store={store}>
      <UrlQlProvider value={client}>
        <App />
      </UrlQlProvider>
    </ReduxProvider>
  </Auth0Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
