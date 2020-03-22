import React from 'react'
import * as RRD from 'react-router-dom'
import Index from './routes/Index/Index'
import Profile from './routes/Profile'
import Scores from './routes/Scores'
import NoMatch from './routes/NoMatch'
import * as Auth0 from "./react-auth0-spa"
import history from "./utilities/history"
import MockGame from './components/MockGame'
import './App.css'

const Navigate = (RRD as any).Navigate
const Routes = (RRD as any).Routes

function App() {
  const { loading, user, isAuthenticated, logout, loginWithRedirect } = Auth0.useAuth0()

  React.useEffect(() => {
    if (loading || isAuthenticated) {
      return
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: '/' }
      })
    }
    fn()
  }, [loading, isAuthenticated, loginWithRedirect])

  if (loading || !user) {
    return <div>Loading...</div>
  }

  return (
    <RRD.Router history={history}>
      <div className="app">
        <header className="app-header">
          <b></b>
          <div className="app-header__content">
            <div className="banner">
              <RRD.NavLink to="/"><h2>Schultz Tables</h2></RRD.NavLink>
            </div>
            <nav>
              <RRD.NavLink className="link" to="/">
                <div className="icon"><i className="material-icons">home</i></div>
                <div className="label">Home</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to="/scores">
                <div className="icon"><i className="material-icons">format_list_numbered</i></div>
                <div className="label">Scores</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to="/users">
                <div className="icon"><i className="material-icons">group</i></div>
                <div className="label">User</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to="/profile">
                <div className="icon"><i className="material-icons">account_circle</i></div>
                <div className="label">Profile</div>
              </RRD.NavLink>
            </nav>
          </div>
          <b></b>
          <div className="app-header__background">
            <div className="app-header__background-clip">
              {Array(50).fill(0).map((_, i) => <MockGame key={i} />)}
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <RRD.Route path="/" element={<Index user={user} />} />
            <RRD.Route path="scores" element={<Scores />} />
            <RRD.Route path="users" element={<Scores />} />
            <RRD.Route path="profile" element={<Profile />} />
            <RRD.Route path="" element={<NoMatch />} />
          </Routes>
        </main>
      </div>
    </RRD.Router>
  )
}

export default App
