import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StartThunk, RootState } from '../../app/store'
import * as models from '../../types/models'
import * as options from '../../utilities/options'
import * as utilities from '../../utilities'
import * as client from '../../services/client'

type State = {
    isGameVisible: boolean
    isGameOptionsVisible: boolean
    gameTypes: models.IOption<models.ITableConfig>[]
    gameTypeIdSelected: string
    signedStartTime: string | null
    table: models.ITable
    gameState: models.IGameState
}

const tableConfig = utilities.generateTableConfig()
const sequence = utilities.generateSymbols(tableConfig)
const table = utilities.generateTable(tableConfig, sequence)

const initialState: State = {
    isGameVisible: false,
    isGameOptionsVisible: false,
    gameTypes: options.presetTables,
    gameTypeIdSelected: options.presetTables[0].id,
    signedStartTime: null,
    table,
    gameState: utilities.generateDefaultGameState()
}

export const slice = createSlice({
    name: 'index',
    initialState,
    reducers: {
        start: (state, action: PayloadAction<{ signedStartTime: string, gameType: models.IOption<models.ITableConfig> }>) => {
            const { signedStartTime, gameType } = action.payload
            const tableConfigSelected = gameType.value
            const sequence = utilities.generateSymbols(tableConfigSelected)
            const table = utilities.generateTable(tableConfigSelected, sequence)
            const defaultGameState = utilities.generateDefaultGameState()

            state.table = table
            state.signedStartTime = signedStartTime
            state.isGameVisible = true
            state.gameState = {
                ...defaultGameState,
                startTime: new Date(),
                isStarted: true
            }
        },
        closeGame: (state) => {
            state.isGameVisible = false
            state.gameState = utilities.generateDefaultGameState()
        },
        clickCell: (state, action: PayloadAction<models.ICell>) => {
            const cell = action.payload
            const prevGameState = state.gameState
            let isCompleted = prevGameState.isCompleted
            if (isCompleted) {
                return state
            }

            const expectedSymbol = state.table.expectedSequence[prevGameState.expectedSymbolIndex]
            const correct = cell.text === expectedSymbol
            let expectedSymbolIndex = prevGameState.expectedSymbolIndex
            let duration = prevGameState.duration
            const userSequence = [...prevGameState.userSequence, {
                correct,
                time: new Date(),
                cell
            }]

            if (correct) {
                if (expectedSymbolIndex === state.table.expectedSequence.length - 1) {
                    isCompleted = true
                    const endTime = new Date()
                    duration = endTime.getTime() - prevGameState.startTime.getTime()
                    const gameTypeSelected = state.gameTypes.find(t => t.id === state.gameTypeIdSelected)!
                    const { width, height, ...gameOptions } = gameTypeSelected.value

                    const scoreRequest: models.IScoreRequest = {
                        duration,
                        endTime,
                        expectedSequence: state.table.expectedSequence,
                        // TODO: API should accept cells so we can do analysis on harder arrangement of numbers
                        randomizedSequence: state.table.cells.map(c => c.text),
                        signedStartTime: state.signedStartTime!,
                        startTime: state.gameState.startTime,
                        tableHeight: height,
                        tableProperties: Object.entries(gameOptions).map(([key, value]) => ({ key, value })),
                        tableWidth: width,
                        userSequence
                    }
                }
                expectedSymbolIndex += 1
            }

            state.gameState = {
                ...prevGameState,
                duration,
                expectedSymbolIndex,
                isCompleted,
                userSequence: userSequence,
            }
        }
    },
})

export const { start, closeGame, clickCell } = slice.actions

export const startThunk = (token: string, gameType: models.IOption<models.ITableConfig>): StartThunk => async dispatch => {
    const signedStartTime = await client.start(token)

    dispatch(start({ signedStartTime, gameType }))
}

export const selectIndex = (state: RootState) =>
    state

export default slice.reducer
