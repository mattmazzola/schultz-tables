import { Score } from "@prisma/client"
import { IScore, IUser } from "~/types/models"

export function convertDbScoreToScore(dbScore: Score, users?: IUser[]): IScore {
    const user = users?.find(u => u.user_id === dbScore.userId)
    const score: IScore = {
        ...dbScore,
        user,
        startTime: dbScore.startTime.toISOString(),
        sequence: JSON.parse(dbScore.userSequence),
        tableLayout: JSON.parse(dbScore.tableLayout),
        endTime: (new Date(dbScore.startTime.valueOf() + dbScore.durationMilliseconds)).toISOString()
    }

    return score
}

export function groupScoresByType(dbScores: Score[], users?: IUser[]): Record<string, IScore[]> {
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