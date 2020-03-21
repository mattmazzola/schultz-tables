export interface ITableLayout {
    expectedSequence: string[]
    randomizedSequence: string[]
    height: number
    width: number
    id: string
}

export interface IKvPair<K, V> {
    Key: K
    Value: V
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
    startTime: string
    endTime: string
    duration: string
    durationMilliseconds: number
    sequence: IAnswer[]
    tableLayoutId: string
    tableTypeId: string
}

export interface IAnswer {
    time: string
    cell: ICell
    correct: boolean
}

export interface ICell {
    text: string
    x: number
    y: number
}