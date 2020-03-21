import { ActionObject } from '../types'
import { AT } from '../types/ActionTypes'
import * as models from '../types/models'
import { ThunkAction } from 'redux-thunk'
import { makeGraphqlRequest } from '../services/graphql'

export const getUserScoresAsync = (): ActionObject =>
    ({
        type: AT.GET_USER_SCORES_ASYNC
    })

export const getUserScoresFulfilled = (userId: string, tableTypeId: string, scores: models.IScore[]): ActionObject =>
    ({
        type: AT.GET_USER_SCORES_FULFILLED,
        userId,
        tableTypeId,
        scores
    })

export const getUserScoresRejected = (reason: string): ActionObject =>
    ({
        type: AT.GET_USER_SCORES_REJECTED,
        reason
    })

export const getUserScoresThunkAsync = (tableTypeId: string, user: models.IUser): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch) => {
        try {
            const response = await makeGraphqlRequest(
                null,
                `{
                    userScores(userId: "${tableTypeId}"){
                      id
                      startTime
                      endTime
                      userId
                      duration
                      durationMilliseconds
                      sequence {
                        correct
                        cell {
                            text
                            x
                            y
                        }
                        time
                      }
                      tableTypeId
                      tableLayoutId
                    }
                  }`)

            if (!response.ok) {
                console.log(`status test: `, response.statusText)
                const text = await response.text()
                throw new Error(text)
            }

            const json: models.IGraphQlResponse<{ userScores: models.IScore[] }> = await response.json()
            if (json.errors && json.errors.length >= 1) {
                throw new Error(json.errors[0].message)
            }

            console.log({ userScores: json })
            const scores: models.IScore[] = json.data.userScores
            scores.forEach(score => {
                score.user = user
            })

            dispatch(getUserScoresFulfilled(user.id, tableTypeId, scores))
        }
        catch (error) {
            console.error(error)
            dispatch(getUserScoresRejected(error))
        }
    }
}