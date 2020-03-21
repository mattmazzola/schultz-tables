import { ActionObject } from '../types'
import { AT } from '../types/ActionTypes'
import * as models from '../types/models'
import { ThunkAction } from 'redux-thunk'
import { makeGraphqlRequest, makeGraphqlMutation } from '../services/graphql'
import * as utilities from '../services/utilities'

export const startScoreAsync = (): ActionObject =>
    ({
        type: AT.START_SCORE_ASYNC
    })

export const startScoreFulfilled = (value: string): ActionObject =>
    ({
        type: AT.START_SCORE_FULFILLED,
        value
    })

export const startScoreRejected = (reason: string): ActionObject =>
    ({
        type: AT.START_SCORE_REJECTED,
        reason
    })

// tslint:disable-next-line
export const startScoreThunkAsync = (): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch) => {
        const response = await makeGraphqlRequest(
            "start",
            `mutation start {
                start (ignored: "") {
                    value
                }
            }`)

        if (!response.ok) {
            console.log(`status test: `, response.statusText)
            const text = await response.text()
            dispatch(startScoreRejected(text))
            throw new Error(text)
        }

        const json: models.IGraphQlResponse<{ start: models.IStartScoreResponse }> = await response.json()
        if (json.errors && json.errors.length >= 1) {
            throw new Error(json.errors[0].message)
        }

        const signedStartTime: string = json.data.start.value
        dispatch(startScoreFulfilled(signedStartTime))
        return signedStartTime
    }
}

export const addScoreAsync = (tableTypeId: string, score: models.IScoreRequest): ActionObject =>
    ({
        type: AT.ADD_SCORE_ASYNC,
        score
    })

export const addScoreFulfilled = (tableTypeId: string, score: models.IScore): ActionObject =>
    ({
        type: AT.ADD_SCORE_FULFILLED,
        tableTypeId,
        score
    })

export const addScoreRejected = (reason: string): ActionObject =>
    ({
        type: AT.ADD_SCORE_REJECTED,
        reason
    })

// tsling:disable-next-line
export const addScoreThunkAsync = (scoreRequest: models.IScoreRequest, user: models.IUser): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch) => {
        try {
            const graphModel = utilities.convertScoreRequstToGraphql(scoreRequest)
            let tableProperties = JSON.stringify(graphModel.tableProperties)
            tableProperties = tableProperties.replace(/\"([^(\")"]+)\":/g,"$1:")

            let userSequence = JSON.stringify(graphModel.userSequence)
            userSequence = userSequence.replace(/\"([^(\")"]+)\":/g,"$1:")

            const response = await makeGraphqlMutation(
                "AddScore",
                `mutation AddScore {
                    addScore (scoreInput: {
                        signedStartTime: "${graphModel.signedStartTime}",
                        userId: "${user.id}",
                        startTime: ${graphModel.startTime},
                        endTime: ${graphModel.endTime},
                        expectedSequence: ${JSON.stringify(graphModel.expectedSequence)}
                        randomizedSequence: ${JSON.stringify(graphModel.randomizedSequence)},
                        userSequence: ${userSequence},
                        tableWidth: ${graphModel.tableWidth},
                        tableHeight: ${graphModel.tableWidth},
                        tableProperties: ${tableProperties}
                    }) {
                        id
                        startTime
                        endTime
                        duration
                        durationMilliseconds
                        sequence {
                            time
                            cell {
                                classes
                                text
                                x
                                y
                            }
                            correct
                        }
                        tableTypeId
                        tableLayoutId
                    }
                }
            `)

            if (!response.ok) {
                console.log(`status test: `, response.statusText)
                const text = await response.text()
                throw new Error(text)
            }

            const json: models.IGraphQlResponse<{ addScore: models.IScoreGraphql }> = await response.json();
            if (json.errors && json.errors.length >= 1) {
                throw new Error(json.errors[0].message)
            }

            const score = json.data.addScore;
            dispatch(addScoreFulfilled(score.tableTypeId, score));
        }
        catch (error) {
            console.error(error);
            dispatch(addScoreRejected(error));
        }
    }
}

export const getScoresAsync = (tableTypeId: string): ActionObject =>
    ({
        type: AT.GET_SCORES_ASYNC,
        tableTypeId
    })

export const getScoresFulfilled = (tableTypeId: string, scoreResponse: models.IScoresResponse): ActionObject =>
    ({
        type: AT.GET_SCORES_FULFILLED,
        tableTypeId,
        scoreResponse
    })

export const getScoresRejected = (reason: string): ActionObject =>
    ({
        type: AT.GET_SCORES_REJECTED,
        reason
    })

// tsling:disable-next-line
export const getScoresThunkAsync = (tableTypeId: string): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch) => {
        try {
            const response = await makeGraphqlRequest(
                null,
                `{
                    scores(tableTypeId: "8khL0PAzn1fLljSPPp6eGpcIHqbA6VPSHdkHGUeRb/s=") {
                      users {
                        id
                        email
                        name
                      }
                      scores {
                        id
                        userId
                        startTime
                        endTime
                        duration
                        durationMilliseconds
                        sequence {
                          cell {
                            x
                            y
                            text
                          }
                          time
                          correct
                        }
                        tableTypeId
                        tableLayoutId
                      }
                    }
                  }`)

            if (!response.ok) {
                console.log(`status test: `, response.statusText)
                const text = await response.text()
                throw new Error(text)
            }

            const json: models.IGraphQlResponse<{ scores: models.IScoresResponse }> = await response.json();
            if (json.errors && json.errors.length >= 1) {
                throw new Error(json.errors[0].message)
            }

            json.data.scores.scores.forEach(score => {
                const user = json.data.scores.users.find(u => u.id === score.userId);
                score.user = user;
            });
            dispatch(getScoresFulfilled(tableTypeId, json.data.scores));
        }
        catch (error) {
            console.error(error);
            dispatch(getScoresRejected(error));
        }
    }
}


export const getTableTypesAsync = (): ActionObject =>
    ({
        type: AT.GET_TABLE_TYPES_ASYNC
    })

export const getTableTypesFulfilled = (tableTypes: models.ITableType[]): ActionObject =>
    ({
        type: AT.GET_TABLE_TYPES_FULFILLED,
        tableTypes
    })

export const getTableTypesRejected = (reason: string): ActionObject =>
    ({
        type: AT.GET_TABLE_TYPES_REJECTED,
        reason
    })

// tsling:disable-next-line
export const getTableTypesThunkAsync = (): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch: any) => {

        const response = await makeGraphqlRequest(
            null,
            `{
                tableTypes {
                    id
                    width
                    height
                    properties {
                        key
                        value
                    }
                }
            }`)

        if (!response.ok) {
            console.log(`status test: `, response.statusText)
            const text = await response.text()
            throw new Error(text)
        }

        const json: models.IGraphQlResponse<{ tableTypes: models.ITableType[] }> = await response.json()
        if (json.errors && json.errors.length >= 1) {
            throw new Error(json.errors[0].message)
        }

        dispatch(getTableTypesFulfilled(json.data.tableTypes))
        return json.data.tableTypes
    }
}

export const getScoreDetailsAsync = (): ActionObject =>
    ({
        type: AT.GET_SCORE_DETAILS_ASYNC
    })

export const getScoreDetailsFulfilled = (scoreDetails: models.IScore): ActionObject =>
    ({
        type: AT.GET_SCORE_DETAILS_FULFILLED,
        scoreDetails
    })

export const getScoreDetailsRejected = (reason: string): ActionObject =>
    ({
        type: AT.GET_SCORE_DETAILS_REJECTED,
        reason
    })

// tsling:disable-next-line
export const getScoreDetailsThunkAsync = (id: string): ThunkAction<Promise<models.IScore | void>, any, any, ActionObject> => {
    return async (dispatch) => {
        try {
            const response = await makeGraphqlRequest(
                null,
                `{
                    score(id: "${id}") {
                      id
                      userId
                      startTime
                      endTime
                      duration
                      durationMilliseconds
                      sequence {
                        cell {
                          classes
                          x
                          y
                          text
                        }
                        time
                        correct
                      }
                      tableType {
                        id
                        width
                        height
                        properties {
                          key
                          value
                        }
                      }
                      tableLayout {
                        id
                        width
                        height
                        expectedSequence
                        randomizedSequence
                      }
                    }
                  }`)

            if (!response.ok) {
                const text = await response.text()
                throw new Error(text)
            }
            const json = await response.json()
            if (json.errors && json.errors.length >= 1) {
                throw new Error(json.errors[0].message)
            }
            const scoreDetails = json
            dispatch(getScoreDetailsFulfilled(scoreDetails));
            return scoreDetails
        }
        catch (error) {
            console.error(error);
            dispatch(getScoreDetailsRejected(error));
            return error;
        }
    }
}