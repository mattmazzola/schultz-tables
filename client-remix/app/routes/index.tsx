import { DataFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { auth, getSession } from "~/services/auth.server"

type LoaderError = { message: string } | null

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request)
  const session = await getSession(request.headers.get("Cookie"))
  const error = session.get(auth.sessionErrorKey) as LoaderError

  return json({
    profile,
    error,
  })
}


export default function Index() {
  const { profile, error } = useLoaderData<typeof loader>()

  const hasProfile = profile !== null && typeof profile === 'object'

  return (
    <div>
      <h1>Index</h1>
      {hasProfile
        ? <div>
            <div>Hi, {profile?.displayName}</div>
          <Form method="post" action="/logout">
            <button type="submit">Sign Out</button>
          </Form>
        </div>
        : (
          <Form method="post" action="/auth">
            {error ? <div>{error.message}</div> : null}
            <p>
              <button type="submit" className="login orangeButton">Sign In</button>
            </p>
            <div>You must sign in before you play the game!</div>
          </Form>
        )}
    </div>
  )
}
