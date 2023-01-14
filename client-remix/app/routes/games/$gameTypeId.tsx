import { DataFunctionArgs, redirect } from "@remix-run/node"
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react"
import { useReducer } from "react"
import Game from "~/components/Game"
import { GameEvent, gameReducer, getObjectFromState, State } from "~/reducers/gameReducer"
import { ICell, IGameState, ITable } from "~/types/models"
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

enum FormNames {
    GameSubmission = 'GameSubmission'
}

export const action = async ({ request }: DataFunctionArgs) => {
    const rawFormData = await request.formData()
    const formData = Object.fromEntries(rawFormData)
    
    if (formData.name) {
        const table: ITable = JSON.parse(formData.table as string)
        const gameState: IGameState = JSON.parse(formData.gameState as string)
        if (gameState.isCompleted) {
            console.log({ table, gameState })
        }

        return redirect('/games')
    }

    return null
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

    const gameStateFetcher = useFetcher()

    const [reducerState, dispatchGameEvent] = useReducer(gameReducer, initialState)

    const onClickCloseGame = () => {
        const data = {
            name: FormNames.GameSubmission,
            ...getObjectFromState(reducerState),
        }

        gameStateFetcher.submit(data, { method: 'post' })
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
