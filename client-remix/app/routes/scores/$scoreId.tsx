import { DataFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { db } from "~/services/db.server"

export const loader = async ({ params }: DataFunctionArgs) => {
    const { scoreId } = params
    const score = await db.score.findUnique({ where: { id: scoreId } })
    if (!score) {
        throw new Error(`Score by id: ${scoreId} was not found`)
    }

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
            <div>{score?.startTime}</div>
        </>
    )
}
