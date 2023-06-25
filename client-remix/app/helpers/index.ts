import { User } from "@clerk/remix/api.server"
import { Score } from "@prisma/client"
import { IScore } from "~/types/models"

export function convertDbScoreToScore(dbScore: Score, users?: User[]): IScore {
    const user = users?.find(u => u.id === dbScore.userId)
    const score: IScore = {
        ...dbScore,
        user,
        startTime: dbScore.startTime.toISOString(),
        userSequence: JSON.parse(dbScore.userSequence),
        table: JSON.parse(dbScore.table),
        endTime: (new Date(dbScore.startTime.valueOf() + dbScore.durationMilliseconds)).toISOString()
    }

    return score
}

export function groupScoresByType(dbScores: Score[], users?: User[]): Record<string, IScore[]> {
    const scoreTypeToScores: Record<string, IScore[]> = {}

    for (const dbScore of dbScores) {
        // Deserialized the serialized properties
        const score = convertDbScoreToScore(dbScore, users)

        // Group by tableTypeId
        scoreTypeToScores[score.tableTypeId] ??= []
        scoreTypeToScores[score.tableTypeId].push(score)
    }

    return scoreTypeToScores
}
