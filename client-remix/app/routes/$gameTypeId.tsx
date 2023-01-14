import { DataFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate, useParams } from "@remix-run/react"
import * as options from '~/utilities/options'
import * as utilities from '~/utilities'
import Game from "~/components/Game"
import { ICell } from "~/types/models"

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
    const { gameType, table, gameState, } = useLoaderData<typeof loader>()
    const navigate = useNavigate()

    const onClickCloseGame = () => {
        navigate(`/games`)
    }

    const onClickCell = (cell: ICell) => {
        playBuzzerSound()
        console.log({ cell })
    }

    return (
        <>
            <h1>Game Type: {gameType.id}</h1>
            <div className="game-container">
                <Game
                    width={table.width}
                    height={table.height}
                    table={table}
                    gameState={gameState}
                    onClickClose={onClickCloseGame}
                    onClickCell={onClickCell}
                />
            </div>
        </>
    )
}