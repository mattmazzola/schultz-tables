import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './routes/App'
import './index.css'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import RSA from 'react-simple-auth'
import { microsoftProvider } from './providers/microsoft'
import { baseUrl } from './services/graphql'

export const createReduxStore = () => createStore(
  rootReducer,
  applyMiddleware(thunk)
)

const client = new ApolloClient({
  uri: baseUrl,
  request: async (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${RSA.getAccessToken(microsoftProvider, '')}`
      }
    })
  },
  name: 'SchultzTables React',
  version: '0.1.0',
})

ReactDOM.render(
  <Provider store={createReduxStore()}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
