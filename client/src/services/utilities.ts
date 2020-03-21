import * as models from '../types/models'
import * as moment from 'moment'

/* tslint:disable */
export function guid(): string {
    var d = new Date().getTime()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}
/* tslint:enable */

export const randomize = <T>(xs: T[]): T[] => {
    let unrandomized = xs.slice(0);
    const randomized = [];

    while (unrandomized.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrandomized.length)
        const randomElement = unrandomized[randomIndex]

        randomized.push(randomElement)
        unrandomized.splice(randomIndex, 1)
    }

    return randomized;
}

export const generateTableConfig = (): models.ITableConfig =>
    ({
        width: 5,
        height: 5,
        symbols: 'numbers',
        font: 'Arial',
        fontColor: 'black',
        cellColor: 'white',
        textEffect: 'none',
        animation: 'none'
    })

const availableLetters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
export const getSymbols = (type: string, length: number) => {
    switch (type) {
        case 'numbers': {
            return Array(length).fill(0).map((_, i) => i + 1).map(x => x.toString())
        }
        case 'letters': {
            if (length > availableLetters.length) {
                throw new Error(`You attempted to get ${length} symbols for ${type} but there are only ${availableLetters.length} available`)
            }

            return availableLetters.filter((_, i) => i < length)
        }
        case 'numbersAndLetters': {
            const numLetters = Math.min(Math.ceil(length / 2), availableLetters.length)
            const numNumbers = length - numLetters

            const letters = availableLetters.filter((_, i) => i < numLetters)
            const numbers = Array(numNumbers).fill(0).map((_, i) => i + 1).map(x => x.toString())

            return [...letters, ...numbers]
        }
        default: {
            return Array(length).fill(0).map((_, i) => i + 1).map(x => x.toString())
        }
    }
}

export const generateSymbols = (tableConfig: models.ITableConfig): models.ISequence => {
    const length = tableConfig.width * tableConfig.height
    const symbols = getSymbols(tableConfig.symbols, length)
    const randomSymbols = randomize(symbols)

    return {
        expectedSequence: symbols,
        randomizedSequence: randomSymbols
    }
}

const rainbowClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].map(c => `cell--color-${c}`)

export const generateTable = (tableConfig: models.ITableConfig, sequence: models.ISequence): models.ITable => {
    const cells = sequence.randomizedSequence.map((symbol, i) => {
        const x = i % tableConfig.width + 1
        const y = Math.floor(i / tableConfig.width) + 1

        const cellClasses = []
        if (tableConfig.textEffect === 'shadow') {
            cellClasses.push('cell--text-effect-shadow')
        }

        if (tableConfig.cellColor === 'rainbow') {
            const randomColorClass = rainbowClasses[Math.floor(Math.random() * rainbowClasses.length)]
            cellClasses.push(randomColorClass)
        }

        return {
            x,
            y,
            text: symbol,
            classes: cellClasses
        }
    })

    const tableClasses: string[] = []
    if (tableConfig.animation === 'linear-horizontal') {
        tableClasses.push('table--animation-linear-horizontal')
    } else if (tableConfig.animation === 'linear-diagonal') {
        tableClasses.push('table--animation-linear-diagonal')
    } else if (tableConfig.animation === 'rotation') {
        tableClasses.push(`table--animation-rotation`)
    }

    return {
        classes: tableClasses,
        width: tableConfig.width,
        height: tableConfig.height,
        expectedSequence: sequence.expectedSequence,
        cells
    }
}

export const generateDefaultGameState = () =>
    ({
        startTime: new Date(),
        duration: 0,
        isStarted: false,
        isCompleted: false,
        isSoundEnabled: true,
        playSoundOnCorrect: false,
        expectedSymbolIndex: 0,
        userSequence: []
    })

export const getTimeDifference = (timeA: string, timeB: string) =>
    moment.duration(moment(timeA).diff(moment(timeB))).asSeconds()

export const getUserTableTypeKey = (userId: string, tableTypeId: string) =>
    `${userId}_${tableTypeId}`

export const convertScoreRequstToGraphql = (scoreRequest: models.IScoreRequest): models.IScoreRequestGraphql => {
    const { startTime, endTime, userSequence, duration, ...scoreGraphql } = scoreRequest

    return {
        ...scoreGraphql,
        userSequence: userSequence.map(answer => ({ ...answer, time: answer.time.getTime() })),
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
    }
}