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
    id: string
    userId: string
    user: IUser | undefined
    startTime: string
    endTime: string
    durationMilliseconds: number
    tableTypeId: string
    userSequence: IUserSelection[]
    table: ITable
}

type ITableDimensions = {
    width: number
    height: number
}

export type ISequence = {
    expectedSequence: string[]
    randomizedSequence: string[]
}

export type ITable
    = ITableDimensions
    & Omit<ISequence, 'randomizedSequence'>
    & {
        classes: string[]
        cells: ICell[]
    }

export type IEntity = {
    id: string
}

export type ITableLayout
    = ITableDimensions
    & ISequence
    & IEntity

export type ITableType
    = IEntity
    & {
        properties: KVPair<string, string>[]
    }

export interface KVPair<K, V> {
    key: K
    value: V
}

export interface ITableProperty {
    className: string
}