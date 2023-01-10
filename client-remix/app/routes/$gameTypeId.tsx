import { DataFunctionArgs } from "@remix-run/node"
import { useParams } from "@remix-run/react"

export default function Game() {
    const params = useParams()

    return (
        <div>
            <h1>Game Type: {params['gameTypeId']}</h1>
        </div>
    )
}