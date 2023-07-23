import type { LinksFunction, LoaderFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react"

import { ClerkApp, V2_ClerkErrorBoundary } from "@clerk/remix"
import { rootAuthLoader } from "@clerk/remix/ssr.server"
import { cssBundleHref } from "@remix-run/css-bundle"
import type { V2_MetaFunction } from "@remix-run/node"
import { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"
import React from "react"
import MockGame from "~/components/MockGame"
import gameStyles from "~/styles/game.css"
import gameComponentStyles from "~/styles/gameComponent.css"
import gamePreviewStyles from "~/styles/gamePreview.css"
import rootStyles from "~/styles/root.css"
import scoreStyles from "~/styles/score.css"
import scoreDetailsStyles from "~/styles/scoreDetails.css"
import sharedStyles from "~/styles/shared.css"
import usersStyles from "~/styles/users.css"

export const meta: V2_MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { viewport: "width=device-width,initial-scale=1" },
    { title: "Schultz Tables" },
    { name: "description", content: "Game to practice using your peripheral vision!" },
  ]
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'apple-touch-icon', href: '/logo.jpg' },
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

const CustomErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    <AppComponent>
      {error.status} {error.statusText}
    </AppComponent>
  }

  return (
    <AppComponent>
      <p>Something went wrong!</p>
      <pre>
        <code>{(error as any)?.message}</code>
      </pre>
    </AppComponent>
  )
}

export const ErrorBoundary = V2_ClerkErrorBoundary(CustomErrorBoundary)

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, {
    loadUser: true,
  })
}

const App = () => {
  return (
    <AppComponent>
      <Outlet />
    </AppComponent>
  )
}

export default ClerkApp(App)

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
                <NavLink className="link" to="/games">
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
          <div>
            {children}
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
