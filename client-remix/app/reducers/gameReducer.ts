import produce from "immer"
import { Reducer } from "react"
import { ICell, IGameState, ITable, IUserSelection } from "~/types/models"
import { getFormData } from "~/utilities"

export type State = {
    signedStartTime: string | null
    table: ITable
    gameState: IGameState
}

export enum GameEvent {
    CLICK_CELL = 'CLICK_CELL'
}

export type GameActions = |
{
    type: GameEvent.CLICK_CELL,
    cell: ICell
}

export const gameReducer: Reducer<State, GameActions> = produce((state, action) => {
    switch (action.type) {
        case ('CLICK_CELL'): {
            const cell = action.cell

            // If game is already completed, ignore
            let isCompleted = state.gameState.isCompleted
            if (isCompleted) {
                return state
            }

            const expectedSymbol = state.table.expectedSequence[state.gameState.expectedSymbolIndex]
            const correct = cell.text === expectedSymbol
            const clickTime = Date.now()
            const newSequenceEntry: IUserSelection = {
                correct,
                time: clickTime,
                cell,
            }

            state.gameState.userSequence.push(newSequenceEntry)

            if (correct) {
                let isLastSymbol = state.gameState.expectedSymbolIndex === state.table.expectedSequence.length - 1
                if (isLastSymbol) {
                    state.gameState.isCompleted = true
                    state.gameState.duration = clickTime - state.gameState.startTime
                }

                state.gameState.expectedSymbolIndex += 1
            }
        }

        default:
            return state
    }
})


export function getObjectFromState(state: State): { [k: string]: string } {
    return getFormData(state)
}
