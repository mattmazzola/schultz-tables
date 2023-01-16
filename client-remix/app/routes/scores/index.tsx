import { DataFunctionArgs, json, LinksFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { GameType } from "~/components/GameType"
import { convertDbScoreToScore } from "~/helpers"
import { auth } from "~/services/auth.server"
import { managementClient } from "~/services/auth0management.server"
import { db } from "~/services/db.server"
import scoresStyles from "~/styles/scores.css"
import { IScore } from "~/types/models"
import * as options from '~/utilities/options'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: scoresStyles },
]

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request, {
    failureRedirect: "/"
  })

  const scoreTypeToScores: Record<string, IScore[]> = {}
  const users = await managementClient.getUsers()
  const dbScores = await db.score.findMany({
    take: 100,
    orderBy: {
      durationMilliseconds: 'asc'
    }
  })

  for (const dbScore of dbScores) {
    // Deserialized the serialized properties
    const score = convertDbScoreToScore(dbScore)
    // Add user
    const user = users.find(u => u.user_id === score.userId)
    score.user = user

    // Group by tableTypeId
    const tableTypeId = score.tableType.id
    scoreTypeToScores[tableTypeId] ??= []
    scoreTypeToScores[tableTypeId].push(score)
  }

  return json({
    profile,
    scoreTypeToScores,
    users,
  })
}

export default function Scores() {
  const { scoreTypeToScores } = useLoaderData<typeof loader>()

  return (
    <>
      <h1>Scores by Table Type:</h1>
      <div className="scoresColumns">
        {options.presetTables.map(gameType => {
          const scoresByType = scoreTypeToScores[gameType.id] ?? []

          return (
            <div key={gameType.id} className="scoreColumn">
              <div className="scoreColumn__header">
                <GameType
                  key={gameType.id}
                  gameType={gameType}
                />
              </div>
              <div className="scoreRefreshButton">
                <button disabled={scoresByType == null} >
                  Refresh Top 50
                </button>
              </div>
              <div>
                {scoresByType.length === 0
                  ? <div className="score">0 Scores</div>
                  : scoresByType.map((s, i) => {
                    let rank: string = `${i + 1}th`
                    if (i === 0) {
                      rank = '1st 🥇'
                    }
                    else if (i === 1) {
                      rank = '2nd 🥈'
                    }
                    else if (i === 2) {
                      rank = `3rd 🥉`
                    }
                    else if (i === 3) {
                      rank = `4th 🌟`
                    }
                    else if (i === 4) {
                      rank = `5th ⭐`
                    }

                    const name = s.user
                      ? (s.user.nickname ?? s.user.name ?? s.user.email)
                      : s.userId
                    return (
                      <div key={s.id} className="score">
                        <div>🏁</div><div>{rank}</div>
                        <div>⌚</div><div>{(s.durationMilliseconds / 1000).toFixed(2)} sec</div>
                        <div>🎯</div><div>{((s.tableLayout.expectedSequence.length / s.sequence.length) * 100).toFixed(2)}%</div>
                        <div>🗓️</div><div suppressHydrationWarning={true}>{new Date(s.startTime).toLocaleDateString('en-us', {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</div>
                        <div>🧑</div><Link to={`/users/${s.userId}`}>{name}</Link>
                        <div>📃</div><Link to={`/scores/${s.id}`}><button type="button" className="viewButton">View Details</button></Link>
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
