import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import rootStyles from "~/styles/root.css"
import sharedStyles from "~/styles/shared.css"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Schultz Tables",
  viewport: "width=device-width,initial-scale=1",
  description: "Game to ractice using your peripheral vision!",
  icon: "/favicon.ico",
})

export const links: LinksFunction = () => [
  { rel: 'manifest', href: 'manifest.json' },
  { rel: 'apple-touch-icon', href: 'logo.jpg' },
  { rel: 'stylesheet', href: rootStyles },
  { rel: 'stylesheet', href: sharedStyles },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <header className="app-header">
            <b></b>
            <div className="app-header__content">
              <div className="banner">
                <NavLink to="/"><h2>Schultz Tables</h2></NavLink>
              </div>
              <nav>
                <NavLink className="link" to="/">
                  <div className="icon"><i className="material-icons">home</i></div>
                  <div className="label">Home</div>
                </NavLink>
                <NavLink className="link" to="/scores">
                  <div className="icon"><i className="material-icons">format_list_numbered</i></div>
                  <div className="label">Scores</div>
                </NavLink>
                <NavLink className="link" to="/users">
                  <div className="icon"><i className="material-icons">group</i></div>
                  <div className="label">Users</div>
                </NavLink>
                <NavLink className="link" to="/profile">
                  <div className="icon"><i className="material-icons">account_circle</i></div>
                  <div className="label">Profile</div>
                </NavLink>
              </nav>
            </div>
            <b></b>
            <div className="app-header__background">
              <div className="app-header__background-clip">
                Mock Game
              </div>
            </div>
          </header>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
