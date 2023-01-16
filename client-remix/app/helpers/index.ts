import { Score } from "@prisma/client"
import { IScore } from "~/types/models"
        
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