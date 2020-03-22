
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
