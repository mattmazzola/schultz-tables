import AT from './ActionTypes'
import * as models from './models'

export interface StartScoreAsync {
    type: AT.START_SCORE_ASYNC
}

export interface StartScoreFulfilled {
    type: AT.START_SCORE_FULFILLED
    value: string
}

export interface StartScoreRejected {
    type: AT.START_SCORE_REJECTED
    reason: string
}

export interface AddScoreAsync {
    type: AT.ADD_SCORE_ASYNC
    score: models.IScoreRequest
}

export interface AddScoreFulfilled {
    type: AT.ADD_SCORE_FULFILLED
    tableTypeId: string
    score: models.IScore
}

export interface AddScoreRejected {
    type: AT.ADD_SCORE_REJECTED
    reason: string
}

export interface UserLoginAction {
    type: AT.USER_LOGIN
    id: string
    name: string
}

export interface UserLogoutAction {
    type: AT.USER_LOGOUT
}

export interface GetTableTypesAsyncAction {
    type: AT.GET_TABLE_TYPES_ASYNC
}

export interface GetTableTypesFulfilledAction {
    type: AT.GET_TABLE_TYPES_FULFILLED
    tableTypes: models.ITableType[]
}

export interface GetTableTypesRejectedAction {
    type: AT.GET_TABLE_TYPES_REJECTED
    reason: string
}

export interface GetUsersAsyncAction {
    type: AT.GET_USERS_ASYNC
}

export interface GetUsersFulfilledAction {
    type: AT.GET_USERS_FULFILLED
    users: models.IUser[]
}

export interface GetUsersRejectedAction {
    type: AT.GET_USERS_REJECTED
    reason: string
}


export interface GetScoresAsyncAction {
    type: AT.GET_SCORES_ASYNC
    tableTypeId: string
}

export interface GetScoresFulfilledAction {
    type: AT.GET_SCORES_FULFILLED
    tableTypeId: string
    scoreResponse: models.IScoresResponse
}

export interface GetScoresRejectedAction {
    type: AT.GET_SCORES_REJECTED
    reason: string
}

export interface GetScoreDetailsAsyncAction {
    type: AT.GET_SCORE_DETAILS_ASYNC
}

export interface GetScoreDetailsFulfilledAction {
    type: AT.GET_SCORE_DETAILS_FULFILLED
    scoreDetails: models.IScore
}

export interface GetScoreDetailsRejectedAction {
    type: AT.GET_SCORE_DETAILS_REJECTED
    reason: string
}


export interface GetUserScoresAsyncAction {
    type: AT.GET_USER_SCORES_ASYNC
}

export interface GetUserScoresFulfilledAction {
    type: AT.GET_USER_SCORES_FULFILLED
    userId: string
    tableTypeId: string
    scores: models.IScore[]
}

export interface GetUserScoresRejectedAction {
    type: AT.GET_USER_SCORES_REJECTED
    reason: string
}

export type ActionObject =
    StartScoreAsync |
    StartScoreFulfilled |
    StartScoreRejected |
    AddScoreAsync |
    AddScoreFulfilled |
    AddScoreRejected |
    UserLoginAction |
    UserLogoutAction |
    GetUsersAsyncAction |
    GetUsersFulfilledAction |
    GetUsersRejectedAction |
    GetScoresAsyncAction |
    GetScoresFulfilledAction |
    GetScoresRejectedAction |
    GetScoreDetailsAsyncAction |
    GetScoreDetailsFulfilledAction |
    GetScoreDetailsRejectedAction |
    GetUserScoresAsyncAction |
    GetUserScoresFulfilledAction |
    GetUserScoresRejectedAction |
    GetTableTypesAsyncAction |
    GetTableTypesFulfilledAction |
    GetTableTypesRejectedAction
