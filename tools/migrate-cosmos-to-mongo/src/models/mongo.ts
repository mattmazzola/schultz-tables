export interface ITableLayout {
    expectedSequence: string[]
    randomizedSequence: string[]
    height: number
    width: number
    id: string
}

export interface IKvPair<K, V> {
    key: K
    value: V
}

export interface ITableType {
    id: string
    width: number
    height: number
    properties: IKvPair<string, string>[]
}

export interface IScore {
    id: string
    userId: string
    startTime: number
    endTime: number
    duration: number
    durationMilliseconds: number
    sequence: IAnswer[]
    tableLayoutId: string
    tableTypeId: string
}

export interface IAnswer {
    time: number
    cell: ICell
    correct: boolean
}

export interface ICell {
    classes: string[]
    text: string
    x: number
    y: number
}