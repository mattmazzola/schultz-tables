import { AppMetadata, User, UserMetadata } from "auth0"

export interface ITableConfig {
    symbols: string
    width: number
    height: number
    font: string
    fontColor: string
    cellColor: string
    textEffect: string
    animation: string
}

export interface ISequence {
    expectedSequence: string[]
    randomizedSequence: string[]
}

export interface ICell {
    x: number
    y: number
    text: string
    classes: string[]
}

export interface IUserSelection<TDate = number> {
    correct: boolean
    time: TDate
    cell: ICell
}

export interface IChosenCell {
    text: string
    used: boolean
    current: boolean
}

export interface IGameState {
    startTime: number
    duration: number
    isStarted: boolean
    isCompleted: boolean
    isSoundEnabled: boolean
    playSoundOnCorrect: boolean
    expectedSymbolIndex: number
    userSequence: IUserSelection[]
}

export interface IOption<T> {
    id: string,
    name: string,
    value: T
}

export type IUser = User<AppMetadata, UserMetadata>

export interface IScore {
    durationMilliseconds: number,
    id: string
    userId: string
    user: IUser | undefined
    startTime: string
    endTime: string
    sequence: IUserSelection[]
    tableLayout: ITableLayout
    tableType: ITableType
}
 
interface ITableBase {
    width: number
    height: number
}

export interface ITable extends ITableBase {
    classes: string[]
    expectedSequence: string[]
    cells: ICell[]
}

export interface ITableLayout extends ITableBase {
    id: string
    expectedSequence: string[]
    randomizedSequence: string[]
}

export interface ITableType extends ITableBase {
    id: string
    properties: KVPair<string, string>[]
}

export interface KVPair<K, V> {
    key: K
    value: V
}

export interface IScoreRequest {
    userSequence: IUserSelection[]
    expectedSequence: string[]
    randomizedSequence: string[]
    signedStartTime: string
    startTime: number
    tableHeight: number
    tableWidth: number
    tableProperties: KVPair<string, string>[]
}

export interface IScoreResponse {
    id: string
    startTime: string
    durationMilliseconds: number
    userSequence: IUserSelection[]
    expectedSequence: string[]
    randomizedSequence: string[]
    tableProperties: KVPair<string, string>[]
    tableWidth: number
    tableHeight: number
    tableTypeId: string
    userId: string
}

export interface ITableProperty {
    className: string
}