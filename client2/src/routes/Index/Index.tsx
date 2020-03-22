import React from "react"
import * as ReactRedux from 'react-redux'
import * as models from '../../types/models'
import * as Auth0 from "../../react-auth0-spa"
import * as IndexSlice from './gameSlice'
import { GameType } from '../../components/GameType'
import Game from '../../components/Game'
import './Index.css'

type Props = {
    user: Auth0.Auth0User
}

const Index: React.FC<Props> = (props) => {
    const { getTokenSilently } = Auth0.useAuth0()
    const indexState = ReactRedux.useSelector(IndexSlice.selectIndex)
    const dispatch = ReactRedux.useDispatch()
    const audio = React.useMemo(() => new AudioContext(), [])

    const onClickStart = async (gameType: models.IOption<models.ITableConfig>) => {
        const token = await getTokenSilently()
        dispatch(IndexSlice.startThunk(token, gameType))
    }

    const onClickCloseGame = () => {
        dispatch(IndexSlice.closeGame)
    }

    const onClickCell = (cell: models.ICell) => {
        dispatch(IndexSlice.clickCell(cell))
    }

    const playBuzzerSound = () => {
        const oscillator = audio.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.value = 300
        oscillator.connect(audio.destination)
        oscillator.start(0)

        setTimeout(() => {
            oscillator.stop()
        }, 150)

        return oscillator
    }

    return (
        <div className="home-page" >
            <h1>Pick a game type below:</h1>

            {!indexState.isGameVisible
                && <div className="game-types">
                    {indexState.gameTypes.map(gameType =>
                        <GameType
                            key={gameType.id}
                            gameType={gameType}
                            onClick={() => onClickStart(gameType)}
                        />)}
                </div>
            }

            {indexState.isGameVisible
                && (
                    <div className="game-container">
                        <Game
                            width={indexState.table.width}
                            height={indexState.table.height}
                            table={indexState.table}
                            gameState={indexState.gameState}
                            onClickClose={onClickCloseGame}
                            onClickCell={onClickCell}
                        />
                    </div>
                )
            }
        </div >
    )
}

export default Index