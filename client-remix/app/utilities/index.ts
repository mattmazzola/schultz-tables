import * as models from '~/types/models'

export async function delay(ms: number) {
    return new Promise((res, rej) => {
        setTimeout(() => res(undefined), ms)
    })
}

export const randomize = <T>(xs: T[]): T[] => {
    let unrandomized = xs.slice(0)
    const randomized = []

    while (unrandomized.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrandomized.length)
        const randomElement = unrandomized[randomIndex]

        randomized.push(randomElement)
        unrandomized.splice(randomIndex, 1)
    }

    return randomized
}

export const pickRandom = <T>(xs: T[]): T => {
    const randomIndex = Math.floor(Math.random() * xs.length)

    return xs[randomIndex]
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
            const randomColorClass = pickRandom(rainbowClasses)
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

export const generateDefaultGameState = (): models.IGameState =>
({
    startTime: Date.now(),
    duration: 0,
    isStarted: false,
    isCompleted: false,
    isSoundEnabled: true,
    expectedSymbolIndex: 0,
    userSequence: [],
})

export const getTimeDifference = (timeAms: number, timeBms: number) => {
    return Math.abs(timeAms - timeBms)
}

export async function sha256(message: string) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message)

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashHex = new TextDecoder().decode(hashBuffer)
    return hashHex
}

export function getFormData(data: object): Record<string, string> {
    const formData: Record<string, string> = {}

    Object.entries(data)
        .reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                for (let [itemIndex, itemValue] of value.entries()) {
                    const itemKey = `${key}${itemIndex}`
                    acc[itemKey] = itemValue ?? ''
                }
            }
            else if (typeof value === 'object' || typeof value === 'boolean') {
                acc[key] = JSON.stringify(value) ?? ''
            } else {
                acc[key] = value ?? null
            }

            return acc
        }, formData)

    return formData
}

// export function exclude<T extends object>(x: T, properties: (keyof T)[]) {


//     for (const [key, value] of Object.entries(x)) {
//         const typedKey: keyof T = key as any
//         if ((properties as string[]).includes(typedKey as string)) {
//             o[typedKey] = value
//         }
//     }

//     return o
// }