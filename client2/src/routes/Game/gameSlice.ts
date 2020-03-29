import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StartThunk, RootState, ClickCellThunk } from '../../app/store'
import * as models from '../../types/models'
import * as options from '../../utilities/options'
import * as utilities from '../../utilities'
import * as client from '../../services/client'
import moment from 'moment'

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
                startTime: Date.now(),
                isStarted: true
            }
        },
        closeGame: (state) => {
            state.isGameVisible = false
            state.gameState = utilities.generateDefaultGameState()
        },
        clickCell: (state, action: PayloadAction<models.ICell>) => {
            const cell = action.payload
            console.log({ cell })

            // If game is already completed, ignore
            let isCompleted = state.gameState.isCompleted
            if (isCompleted) {
                return state
            }

            const expectedSymbol = state.table.expectedSequence[state.gameState.expectedSymbolIndex]
            const correct = cell.text === expectedSymbol
            const clickTime = Date.now()
            const newSequenceEntry: models.IUserSelection = {
                correct,
                time: clickTime,
                cell,
            }

            state.gameState.userSequence.push(newSequenceEntry)

            if (correct) {
                state.gameState.duration = clickTime - state.gameState.startTime
                state.gameState.expectedSymbolIndex += 1
            }
        }
    },
})

const { start, closeGame, clickCell } = slice.actions
export { closeGame, clickCell }

export const startThunk = (token: string, gameType: models.IOption<models.ITableConfig>): StartThunk => async dispatch => {
    const signedStartTime = await client.start(token)

    dispatch(start({ signedStartTime, gameType }))
}

export const clickCellThunk = (token: string, cell: models.ICell): ClickCellThunk => async dispatch => {

}

export const selectIndex = (state: RootState) =>
    state.game

export default slice.reducer
