import { DataFunctionArgs, json, LinksFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { auth } from "~/services/auth.server"
import { IScore, IScoresResponse } from "~/types/models"
import * as options from '~/utilities/options'
import scoresStyles from "~/styles/scores.css"
import { managementClient } from "~/services/auth0management.server"
import { GameType } from "~/components/GameType"

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: scoresStyles },
]

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request, {
    failureRedirect: "/"
  })
  const scoreTypeToScores: Record<string, IScoresResponse> = {}

  const users = await managementClient.getUsers()

  return json({
    profile,
    scoreTypeToScores,
    users
  })
}

export default function Scores() {
  const { scoreTypeToScores } = useLoaderData<typeof loader>()

  return (
    <>
      <h1>Scores by Table Type:</h1>
      <div className="scoresColumns">
        {options.presetTables.map(gameType => {
          const scoresByType = scoreTypeToScores[gameType.id]
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
                {(scoresByType?.scores ?? []).length === 0
                  ? <div className="score">0 Scores</div>
                  : (scoresByType?.scores ?? []).map((s, i) => {
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
                        <div>⏲</div><div>{s.startTime}</div>
                        <div>🧑</div><div className="scoreName" title={name}>{name}</div>
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
