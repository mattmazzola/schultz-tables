import { DataFunctionArgs, redirect } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { useReducer } from "react"
import Game from "~/components/Game"
import { GameEvent, gameReducer, getObjectFromState, State } from "~/reducers/gameReducer"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"
import { ICell, IGameState, ITable } from "~/types/models"
import * as utilities from '~/utilities'
import * as options from '~/utilities/options'

export const loader = ({ params }: DataFunctionArgs) => {
    const { tableTypeId } = params
    const tableTypeOption = options.presetTables.find(t => t.id === tableTypeId)
    if (!tableTypeOption) {
        throw new Error(`You attempted to find game type by id: ${tableTypeId}. However, that type was not found. Please select a different type.`)
    }

    const sequence = utilities.generateSymbols(tableTypeOption.value)
    const table = utilities.generateTable(tableTypeOption.value, sequence)
    const defaultGameState = utilities.generateDefaultGameState()

    return {
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

export const action = async ({ request, params }: DataFunctionArgs) => {
    const { tableTypeId } = params
    const profile = await auth.isAuthenticated(request, {
        failureRedirect: "/"
    })
    const rawFormData = await request.formData()
    const formData = Object.fromEntries(rawFormData)

    if (formData.name) {
        const table: ITable = JSON.parse(formData.table as string)
        const gameState: IGameState = JSON.parse(formData.gameState as string)
        if (gameState.isCompleted) {
            await db.score.create({
                data: {
                    userId: profile.id!,
                    startTime: new Date(gameState.startTime),
                    durationMilliseconds: gameState.duration,
                    tableTypeId: tableTypeId!,
                    userSequence: JSON.stringify(gameState.userSequence),
                    table: JSON.stringify(table),
                }
            })
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
    const { table, gameState: loaderGameState } = useLoaderData<typeof loader>()
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
    )
}
