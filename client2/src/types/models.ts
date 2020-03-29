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

export interface ITable {
    classes: string[]
    width: number
    height: number
    expectedSequence: string[]
    cells: ICell[]
}

export interface IOption<T> {
    id: string,
    name: string,
    value: T
}

export interface IMongoError {
    extensions: any
    locations: any
    message: string
    path: string[]
}
export interface IGraphQlResponse<T> {
    data: T
    errors: IMongoError[]
}

export interface IUser {
    name: string
    id: string
}

export interface IScoresResponse {
    scores: IScore[]
    users: IUser[]
    continuationToken: string | null
}

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

export interface IScoreGraphql extends IScore {
    tableLayoutId: string
    tableTypeId: string
}

export interface ITableLayout {
    id: string
    height: number
    width: number
    expectedSequence: string[]
    randomizedSequence: string[]
}

export interface ITableType {
    id: string
    width: number
    height: number
    properties: KVPair<string, string>[]
}

export interface KVPair<K,V> {
    key: K
    value: V
}

export interface IScoreRequest {
    expectedSequence: string[]
    randomizedSequence: string[]
    signedStartTime: string
    startTime: number
    tableHeight: number
    tableWidth: number
    tableProperties: KVPair<string, string>[]
    userSequence: IUserSelection[]
}

export interface IScoreRequestGraphql {
    expectedSequence: string[]
    randomizedSequence: string[]
    signedStartTime: string
    startTime: number
    tableHeight: number
    tableWidth: number
    tableProperties: KVPair<string, string>[]
    userSequence: IUserSelection<number>[]
}

export interface IScoreResponse {
    duration: string
    durationMilliseconds: number
    endTime: string
    id: string
    sequence: IUserSelection[]
    startTime: string
    tableLayoutId: string
    tableTypeId: string
    userId: string
}

export interface IStartScoreResponse {
    value: string
}

export interface ITableProperty {
    className: string
}