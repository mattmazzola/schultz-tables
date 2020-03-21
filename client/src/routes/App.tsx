import * as React from 'react'
import * as RRD from 'react-router-dom'
import './App.css'
import Home from './Home'
import Scores from './Scores'
import Profile from './Profile'
import Users from './Users'
import User from './User'
import NoMatch from './NoMatch'
import MockGame from '../components/MockGame'

const App: React.FC = () => {
  return (
    <RRD.BrowserRouter>
      <div className="app">
        <header className="app-header">
          <b></b>
          <div className="app-header__content">
            <div className="banner">
              <RRD.NavLink to="/"><h2>Schultz Tables</h2></RRD.NavLink>
            </div>
            <nav>
              <RRD.NavLink className="link" to="/" exact={true}>
                <div className="icon"><i className="material-icons">home</i></div>
                <div className="label">Home</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to="/scores" exact={true}>
                <div className="icon"><i className="material-icons">format_list_numbered</i></div>
                <div className="label">Scores</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to="/users" exact={true}>
                <div className="icon"><i className="material-icons">group</i></div>
                <div className="label">User</div>
              </RRD.NavLink>
              <RRD.NavLink className="link" to={{ pathname: `/profile` }} exact={true}>
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
          <RRD.Switch>
            <RRD.Route path="/" exact={true} component={Home} />
            <RRD.Route path="/profile" exact={true} component={Profile} />
            <RRD.Route path="/scores" exact={true} component={Scores} />
            <RRD.Route path="/users" exact={true} component={Users} />
            <RRD.Route path="/users/:userId" component={User} />
            <RRD.Route component={NoMatch} />
          </RRD.Switch>
        </main>
      </div>
    </RRD.BrowserRouter>
  );
}

export default App
