import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { DataFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import ScoreDetails from "~/components/ScoreDetails"
import { convertDbScoreToScore } from "~/helpers"
import { db } from "~/services/db.server"

export const loader = async (args: DataFunctionArgs) => {
    const { scoreId } = args.params
    const dbScore = await db.score.findUnique({ where: { id: scoreId } })
    if (!dbScore) {
        throw new Error(`Score by id: ${scoreId} was not found`)
    }

    const { userId } = await getAuth(args);
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    })
    const user = await clerkClient.users.getUser(userId!)
    // const user = await managementClient.getUser({ id: dbScore.userId })
    const score = convertDbScoreToScore(dbScore, [user])

    return {
        score
    }
}

export default function Score() {
    const { scoreId } = useParams()
    const { score } = useLoaderData<typeof loader>()

    return (
        <>
            <h1><Link to="/scores">Scores</Link> &gt; Score: {scoreId}</h1>
            <ScoreDetails score={score as any} />
        </>
    )
}
