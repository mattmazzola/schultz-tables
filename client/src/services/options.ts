import * as models from '../types/models'

export const presetTables: models.IOption<models.ITableConfig>[] = [
    {
        id: '0',
        name: '4x4 Numbers - Black on White',
        value: {
            width: 4,
            height: 4,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '1',
        name: '5x5 Numbers - Black on White',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '2',
        name: '6x6 Numbers - Black on White',
        value: {
            width: 6,
            height: 6,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '2.1',
        name: '5x5 Letters - Black on White',
        value: {
            width: 5,
            height: 5,
            symbols: 'letters',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '3',
        name: '5x5 Numbers & Letters',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbersAndLetters',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '4',
        name: '5x5 Numbers - Shadow',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'shadow',
            animation: 'none'
        }
    },
    {
        id: '5',
        name: '5x5 Numbers - Rainbow',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'rainbow',
            textEffect: 'none',
            animation: 'none'
        }
    },
    {
        id: '6',
        name: '5x5 Numbers - Shake horizontal',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'linear-horizontal'
        }
    },
    {
        id: '7',
        name: '5x5 Numbers - Shake diagonal',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'linear-diagonal'
        }
    },
    {
        id: '8',
        name: '5x5 Numbers - Rotation',
        value: {
            width: 5,
            height: 5,
            symbols: 'numbers',
            font: 'Arial',
            fontColor: 'black',
            cellColor: 'white',
            textEffect: 'none',
            animation: 'rotation'
        }
    }
]

export const fonts: models.IOption<models.ITableProperty>[] = [
    {
        id: "0",
        name: 'Arial',
        value: {
            className: 'font-class--arial'
        }
    },
    {
        id: "1",
        name: 'Times New Roman',
        value: {
            className: 'font-class--times-new-roman'
        }
    },
    {
        id: "2",
        name: 'Comic Sans',
        value: {
            className: 'font-class--comic-sans'
        }
    },
]

export const fontColors: string[] = [
    'Black'
]