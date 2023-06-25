import { createClerkClient } from "@clerk/remix/api.server"
import { DataFunctionArgs, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import React from "react"

export const loader = async ({ request }: DataFunctionArgs) => {

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    })
    const users = await clerkClient.users.getUserList()

    return json({
        users,
    })
}

export default function Users() {
    const { users } = useLoaderData<typeof loader>()

    return (
        <>
            <h1>Users</h1>
            <div className="users">
                <div>#</div><div>Image</div><div>Name</div><div>Email</div><div>Id</div><div>View</div>
                {users.map((user, i) => {
                    return (
                        <React.Fragment key={user.id}>
                            <div>{i + 1}</div><img src={user.imageUrl} className="userImage" /><div>{user.username ?? user.firstName ?? user.id}</div><div>{user.emailAddresses.at(0)?.emailAddress}</div><div>{user.id}</div><Link to={`/users/${user.id}`}>Vew</Link>
                        </React.Fragment>
                    )
                })}
            </div>
        </>
    )
}
