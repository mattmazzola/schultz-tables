import { Score } from "@prisma/client"
import { IScore, IUser } from "~/types/models"

export function convertDbScoreToScore(dbScore: Score): IScore {
    const score: IScore = {
        ...dbScore,
        user: undefined,
        startTime: dbScore.startTime.toISOString(),
        sequence: JSON.parse(dbScore.userSequence),
        tableLayout: JSON.parse(dbScore.tableLayout),
        tableType: JSON.parse(dbScore.tableType),
        endTime: (new Date(dbScore.startTime.valueOf() + dbScore.durationMilliseconds)).toISOString()
    }

    return score
}

export function groupScoresByType(dbScores: Score[], tableTypeIds: string[], users?: IUser[]): Record<string, IScore[]> {
    const scoreTypeToScores: Record<string, IScore[]> = {}

    for (const dbScore of dbScores) {
        // Deserialized the serialized properties
        const score = convertDbScoreToScore(dbScore)
        // Add user
        const user = users?.find(u => u.user_id === score.userId)
        score.user = user

        // Group by tableTypeId
        const tableTypeId = score.tableType.id
        scoreTypeToScores[tableTypeId] ??= []
        scoreTypeToScores[tableTypeId].push(score)
    }

    return scoreTypeToScores
}