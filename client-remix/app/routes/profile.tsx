import { DataFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { auth } from "~/services/auth.server"

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request, {
    failureRedirect: "/"
  })

  return json({
    profile,
  })
}

export default function Profile() {
  const { profile } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Profile</h1>
      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </div>
  )
}
