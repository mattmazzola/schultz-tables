import { DataFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { auth } from "~/services/auth.server"
import { managementClient } from "~/services/auth0management.server"

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request, {
    failureRedirect: "/"
  })

  const users = await managementClient.getUsers()

  return json({
    profile,
    users,
  })
}
export default function Users() {
  const { profile, users } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Users</h1>
      <div className="users">
        <div>#</div><div>Name</div><div>Email</div><div>Id</div>
        {users.map((user, i) => {
          return (
            <>
              <div>{i + 1}</div><div>{user.nickname}</div><div>{user.email}</div><div>{user.user_id}</div>
            </>
          )
        })}
      </div>
    </div>
  )
}
