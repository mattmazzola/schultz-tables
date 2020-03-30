import React from "react"
import * as models from '../../types/models'
import * as client from '../../services/client'
import * as Auth0 from "../../react-auth0-spa"
import { GameType } from '../../components/GameType'
import Game from '../../components/Game'
import { useSelector, useDispatch } from 'react-redux'
import * as GameSlice from './gameSlice'
import './Game.css'

type Props = {
    user: Auth0.Auth0User
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

const GameRoute: React.FC<Props> = (props) => {
    const state = useSelector(GameSlice.selectIndex)
    const dispatch = useDispatch()
    const { getTokenSilently, user } = Auth0.useAuth0()

    const onClickStart = async (gameType: models.IOption<models.ITableConfig>) => {
        const token = await getTokenSilently()
        dispatch(GameSlice.startThunk(token, gameType))
    }

    const onClickCloseGame = () => {
        dispatch(GameSlice.closeGame())
    }

    const onClickCell = (cell: models.ICell) => {
        // If game is already completed, ignore
        let isCompleted = state.gameState.isCompleted
        if (isCompleted) {
            return state
        }

        const expectedSymbol = state.table.expectedSequence[state.gameState.expectedSymbolIndex]
        const correct = cell.text === expectedSymbol
        if (correct === false) {
            playBuzzerSound()
        }

        dispatch(GameSlice.clickCell(cell))
    }

    React.useEffect(() => {
        async function submitScore(scoreRequest: models.IScoreRequest) {
            if (user === undefined) {
                return
            }

            const token = await getTokenSilently()
            await client.addScore(token, user.sub, scoreRequest)
        }

        let isLastSymbol = state.gameState.expectedSymbolIndex === state.table.expectedSequence.length
        if (isLastSymbol) {
            const gameTypeSelected = state.gameTypes.find(t => t.id === state.gameTypeIdSelected)!
            const { width, height, ...gameOptions } = gameTypeSelected.value

            const scoreRequest: models.IScoreRequest = {
                expectedSequence: state.table.expectedSequence,
                // TODO: API should accept cells so we can do analysis on harder arrangement of numbers
                randomizedSequence: state.table.cells.map(c => c.text),
                signedStartTime: state.signedStartTime!,
                startTime: state.gameState.startTime,
                tableHeight: height,
                tableProperties: Object.entries(gameOptions).map(([key, value]) => ({ key, value })),
                tableWidth: width,
                userSequence: state.gameState.userSequence
            }

            submitScore(scoreRequest)
        }
    }, [state.gameState.expectedSymbolIndex, state.gameState.isCompleted])

    return (
        <div className="home-page" >
            {state.isGameVisible === false
                && <>
                    <h1>Pick a game type below:</h1>
                    <div className="game-types">
                        {state.gameTypes.map(gameType =>
                            <GameType
                                key={gameType.id}
                                gameType={gameType}
                                onClick={() => onClickStart(gameType)}
                            />)}
                    </div>
                </>
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

export default GameRoute