import React from "react"
import * as models from '../../types/models'
import * as utilities from '../../utilities'
import * as options from '../../utilities/options'
import * as Auth0 from "../../react-auth0-spa"
import { GameType } from '../../components/GameType'
import Game from '../../components/Game'
import produce from "immer"
import * as client from '../../services/client'
import './Index.css'

interface State {
    isGameVisible: boolean
    isGameOptionsVisible: boolean
    gameTypes: models.IOption<models.ITableConfig>[]
    gameTypeIdSelected: string
    signedStartTime: string | null
    table: models.ITable
    gameState: models.IGameState
}

enum ActionTypes {
    Start = 'Start',
    Close = 'Close',
    ClickCell = 'ClickCell',
}

type Action
    = {
        type: ActionTypes.Start
        payload: {
            signedStartTime: string
            gameType: models.IOption<models.ITableConfig>
        }
    } | {
        type: ActionTypes.Close
    } | {
        type: ActionTypes.ClickCell
        payload: models.ICell
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

const reducer: React.Reducer<State, Action> = produce((state: State, action: Action) => {
    switch (action.type) {
        case ActionTypes.Start: {
            const { signedStartTime, gameType } = action.payload
            const tableConfigSelected = gameType.value
            const sequence = utilities.generateSymbols(tableConfigSelected)
            state.table = utilities.generateTable(tableConfigSelected, sequence)

            state.signedStartTime = signedStartTime
            state.isGameVisible = true
            state.gameState = {
                ...utilities.generateDefaultGameState(),
                startTime: new Date(),
                isStarted: true,
            }
            break
        }
        case ActionTypes.Close: {
            state.isGameVisible = false
            state.gameState = utilities.generateDefaultGameState()
            break
        }
        case ActionTypes.ClickCell: {
            const cell = action.payload
            let isCompleted = state.gameState.isCompleted
            if (isCompleted) {
                return
            }

            const expectedSymbol = state.table.expectedSequence[state.gameState.expectedSymbolIndex]
            const correct = cell.text === expectedSymbol
            const newSequenceEntry = {
                correct,
                time: new Date(),
                cell
            }

            state.gameState.userSequence.push(newSequenceEntry)

            if (correct) {
                let expectedSymbolIndex = state.gameState.expectedSymbolIndex
                if (expectedSymbolIndex === state.table.expectedSequence.length - 1) {
                    isCompleted = true
                    const endTime = new Date()
                    const duration = endTime.getTime() - state.gameState.startTime.getTime()
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
                        userSequence: [...state.gameState.userSequence],
                    }
                    // const { id, name } = props.user
                    // props.addScoreThunkAsync(scoreRequest, { id, name })
                    return
                }

                state.gameState.expectedSymbolIndex += 1
            }
        }
    }
})

type Props = {
    user: Auth0.Auth0User
}

const Index: React.FC<Props> = (props) => {
    const { getTokenSilently } = Auth0.useAuth0()
    const [state, dispatch] = React.useReducer(reducer, initialState)

    const onClickStart = async (gameType: models.IOption<models.ITableConfig>) => {
        const token = await getTokenSilently()
        const signedStartTime = await client.start(token)

        dispatch({
            type: ActionTypes.Start,
            payload: { signedStartTime, gameType }
        })
    }

    const onClickCloseGame = () => {
        dispatch({ type: ActionTypes.Close })
    }

    const onClickCell = (cell: models.ICell) => {
        dispatch({
            type: ActionTypes.ClickCell,
            payload: cell,
        })
    }

    const playBuzzerSound = () => {
        const audio = new AudioContext()
        const oscillator = audio.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.value = 600
        oscillator.connect(audio.destination)
        oscillator.start(0)

        setTimeout(() => {
            oscillator.stop()
        }, 150)
    }

    console.log(`Expected symbol: `, state.table.expectedSequence[state.gameState.expectedSymbolIndex])
    console.log(`User Sequence: `, state.gameState.userSequence.map(us => us.cell.text))

    return (
        <div className="home-page" >
            <h1>Pick a game type below:</h1>

            {state.isGameVisible === false
                && <div className="game-types">
                    {state.gameTypes.map(gameType =>
                        <GameType
                            key={gameType.id}
                            gameType={gameType}
                            onClick={() => onClickStart(gameType)}
                        />)}
                </div>
            }

            {state.isGameVisible
                && (
                    <div className="game-container">
                        <Game
                            width={state.table.width}
                            height={state.table.height}
                            table={state.table}
                            gameState={state.gameState}
                            onClickClose={onClickCloseGame}
                            onClickCell={onClickCell}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default Index