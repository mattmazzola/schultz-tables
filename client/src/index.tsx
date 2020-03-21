import React from 'react'
import ReactDOM from 'react-dom'
import App from './routes/App'
import { Auth0Provider } from "./react-auth0-spa"
import config from "./auth_config.json"
import history from "./utils/history"
import './index.css'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import { baseUrl } from './services/graphql'

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
  history.push(
    (appState && appState.targetUrl) || window.location.pathname
  )
}

export const createReduxStore = () => createStore(
  rootReducer,
  applyMiddleware(thunk)
)

const client = new ApolloClient({
  uri: baseUrl,
  request: async (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${''}`
      }
    })
  },
  name: 'SchultzTables React',
  version: '0.1.0',
})

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    audience={config.audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <Provider store={createReduxStore()}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </Auth0Provider>,
  document.getElementById('root') as HTMLElement
)
