import { createClerkClient } from '@clerk/remix/api.server'
import { DataFunctionArgs, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { db } from '~/services/db.server'

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const { userId } = params

    if (!userId) {
      return redirect('/')
    }

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    })
    const user = await clerkClient.users.getUser(userId)
    const userScores = await db.score.findMany({
        where: {
            userId: user.id
        }
    })

    return json({
        user,
        userScores
    })
}

export default function Users() {
    const { user, userScores } = useLoaderData<typeof loader>()

    return (
        <>
            <h1><Link to="/users">Users</Link> &gt; User</h1>
            <div className="user">
                <img src={user.imageUrl} className="userImage" /><div>{user.username}</div><div>{user.emailAddresses.at(0)?.emailAddress}</div><div>{user.id}</div>
            </div>
            {userScores.map(score => {
                return (
                    <div key={score.id}>{score.id}</div>
                )
            })}
        </>
    )
}
