import { DataFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { useReducer } from "react"
import Game from "~/components/Game"
import { GameEvent, gameReducer, State } from "~/reducers/gameReducer"
import { ICell } from "~/types/models"
import * as utilities from '~/utilities'
import * as options from '~/utilities/options'

export const loader = ({ params }: DataFunctionArgs) => {
    const gameTypeId = params['gameTypeId']
    const gameType = options.presetTables.find(t => t.id === gameTypeId)
    if (!gameType) {
        throw new Error(`You attempted to find game type by id: ${gameTypeId}. However that type was not found. Please select a different type.`)
    }

    const tableConfigSelected = gameType.value
    const sequence = utilities.generateSymbols(tableConfigSelected)
    const table = utilities.generateTable(tableConfigSelected, sequence)
    const defaultGameState = utilities.generateDefaultGameState()

    return {
        gameType,
        table,
        gameState: {
            ...defaultGameState,
            startTime: Date.now(),
            isStarted: true
        }
    }
}

const playBuzzerSound = () => {
    const audio = new AudioContext()
    const gainNode = audio.createGain()
    gainNode.gain.value = 0.5

    const oscillator = audio.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.value = 600
    oscillator
        .connect(gainNode)
        .connect(audio.destination)

    oscillator.start(0)

    setTimeout(() => {
        oscillator.stop()
    }, 150)
}

export default function GameRoute() {
    const { gameType, table, gameState: loaderGameState } = useLoaderData<typeof loader>()
    const navigate = useNavigate()
    const initialState: State = {
        signedStartTime: null,
        table,
        gameState: loaderGameState
    }

    const [reducerState, dispatchGameEvent] = useReducer(gameReducer, initialState)

    const onClickCloseGame = () => {
        navigate(`/games`)
    }

    const onClickCell = (cell: ICell) => {
        let isCompleted = reducerState.gameState.isCompleted
        if (isCompleted) {
            return
        }

        const expectedSymbol = reducerState.table.expectedSequence[reducerState.gameState.expectedSymbolIndex]
        const correct = cell.text === expectedSymbol
        if (!correct) {
            playBuzzerSound()
        }

        dispatchGameEvent({
            type: GameEvent.CLICK_CELL,
            cell
        })
    }

    return (
        <>
            <h1>Game Type: {gameType.id}</h1>
            <div className="game-container">
                <Game
                    width={table.width}
                    height={table.height}
                    table={table}
                    gameState={reducerState.gameState}
                    onClickClose={onClickCloseGame}
                    onClickCell={onClickCell}
                />
            </div>
        </>
    )
}