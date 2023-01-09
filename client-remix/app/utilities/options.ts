import * as models from '../types/models'

export const presetTables: models.IOption<models.ITableConfig>[] = [
    {
        id: '94dc27963c4c0828c7610af18a6b4f98c772880054a5f50376ab801973f759ed',
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
        id: '560dbb73462168543d8da8f96ba3d3cd26fbca2b2e8406fbaa0707d318037d07',
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
        id: 'ed2ac67b88d68795aee8d6e6d906cbbc397bb526dca604a0788ea66054b75630',
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
        id: '11d3359d3e3ff4c19ba1a96eaf9fe1101aefbc6d5ec99256f9dd9d230b05f338',
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
        id: '0762d3c0179a908cfc55df1ce91b074651e524480ad60c0764fb10c8a4fee20b',
        name: '5x5 Numbers & Letters - Black on White',
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
        id: '7df01de926f9bdfb651429643926c83cffb477af55b253730616ba44357426fc',
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
        id: '215400d472ac84dabda6ca11c46506c02861d4b8cf204070683c72ad45be659d',
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
        id: '2e7dc22ccdf1e3c97058a06527f798cd58c43861b3ee901a0b47840c32d6ed3b',
        name: '5x5 Numbers - Shake Horizontal',
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
        id: 'b8e2c4bb883f1d99c245f0122c9d47e8be85d16127c857d8827663cef23b16e9',
        name: '5x5 Numbers - Shake Diagonal',
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
        id: '5882a4c9f1a26aa704c14b73f088b916efff38b3ca17922bbdbf1a9fa3076a36',
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