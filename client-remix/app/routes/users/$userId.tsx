import { DataFunctionArgs, json } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { auth } from "~/services/auth.server"
import { managementClient } from "~/services/auth0management.server"

export const loader = async ({ request, params }: DataFunctionArgs) => {
    await auth.isAuthenticated(request, {
        failureRedirect: "/"
    })

    const user = await managementClient.getUser({ id: params.userId! })

    return json({
        user,
    })
}

export default function Users() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <div>
            <h1><Link to="/users">Users</Link> &gt; User</h1>
            <div className="user">
                <img src={user.picture} className="userImage" /><div>{user.nickname}</div><div>{user.email}</div><div>{user.user_id}</div>
            </div>
        </div>
    )
}