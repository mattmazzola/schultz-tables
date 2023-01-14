import type { ErrorBoundaryComponent, LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react"

import rootStyles from "~/styles/root.css"
import sharedStyles from "~/styles/shared.css"
import gamePreviewStyles from "~/styles/gamePreview.css"
import gameComponentStyles from "~/styles/gameComponent.css"
import gameStyles from "~/styles/game.css"
import scoreStyles from "~/styles/score.css"
import scoreDetailsStyles from "~/styles/scoreDetails.css"
import usersStyles from "~/styles/users.css"
import MockGame from "~/components/MockGame"
import React from "react"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Schultz Tables",
  viewport: "width=device-width,initial-scale=1",
  description: "Game to practice using your peripheral vision!",
  icon: "/favicon.ico",
})

export const links: LinksFunction = () => [
  { rel: 'manifest', href: 'manifest.json' },
  { rel: 'apple-touch-icon', href: 'logo.jpg' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' },
  { rel: 'stylesheet', href: rootStyles },
  { rel: 'stylesheet', href: sharedStyles },
  { rel: 'stylesheet', href: gamePreviewStyles },
  { rel: 'stylesheet', href: gameComponentStyles },
  { rel: 'stylesheet', href: gameStyles },
  { rel: 'stylesheet', href: scoreStyles },
  { rel: 'stylesheet', href: scoreDetailsStyles },
  { rel: 'stylesheet', href: usersStyles },
]

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <AppComponent>
      <p>Something went wrong!</p>
      <pre>
        <code>{error.message}</code>
      </pre>
    </AppComponent>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <AppComponent>
      {caught.status} {caught.statusText}
    </AppComponent>
  )
}

export default function App() {
  return (
    <AppComponent>
      <Outlet />
    </AppComponent>
  )
}

const AppComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
                <NavLink to="/"><h1>Schultz Tables</h1></NavLink>
              </div>
              <nav>
                <NavLink className="link" to="/">
                  <div className="icon"><span className="material-symbols-outlined">home</span></div>
                  <div className="label">Home</div>
                </NavLink>
                <NavLink className="link" to="/scores">
                  <div className="icon"><span className="material-symbols-outlined">score</span></div>
                  <div className="label">Scores</div>
                </NavLink>
                <NavLink className="link" to="/users">
                  <div className="icon"><span className="material-symbols-outlined">group</span></div>
                  <div className="label">Users</div>
                </NavLink>
                <NavLink className="link" to="/profile">
                  <div className="icon"><span className="material-symbols-outlined">account_circle</span></div>
                  <div className="label">Profile</div>
                </NavLink>
              </nav>
            </div>
            <b></b>
            <div className="app-header__background">
              <div className="app-header__background-clip">
                {Array(70).fill(0).map((_, i) => <MockGame key={i} index={i} />)}
              </div>
            </div>
          </header>
        </div>
        <main>
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
