import * as models from './models'

export interface ScoresState {
    tableTypes: models.ITableType[]
    scoresByType: { [x: string]: models.IScoresResponse }
}

export type UsersState = models.IUser[]

export type ProfileState = {
    tableTypes: models.ITableType[]
    scoresByUserAndType: { [key: string]: models.IScore[] }
}

export interface UserState extends models.IUser{
    isLoggedIn: boolean
}

export interface ReduxState {
    user: UserState
    users: UsersState
    scores: ScoresState
    profile: ProfileState
}
