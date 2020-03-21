import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { startScoreThunkAsync, addScoreThunkAsync } from '../actions/scoresActions'
import { ReduxState } from '../types'
import './Home.css'
import * as models from '../types/models'
import * as utilities from '../services/utilities'
import * as options from '../services/options'
import Game from '../components/Game'
import { GameType } from '../components/GameType';

interface State {
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

export class Home extends React.Component<Props, State> {
  audio = new AudioContext()
  state = initialState

  async onClickStart(gameType: models.IOption<models.ITableConfig>) {
    const startScoreThunkAsync: () => Promise<string> = this.props.startScoreThunkAsync as any
    const tableConfigSelected = gameType.value
    const sequence = utilities.generateSymbols(tableConfigSelected)
    const table = utilities.generateTable(tableConfigSelected, sequence)
    const signedStartTime = await startScoreThunkAsync()

    this.setState({
      table,
      signedStartTime,
      isGameVisible: true,
      gameState: {
        ...utilities.generateDefaultGameState(),
        startTime: new Date(),
        isStarted: true
      }
    })
  }

  onClickCloseGame = () => {
    this.setState({
      isGameVisible: false,
      gameState: utilities.generateDefaultGameState()
    })
  }

  onClickCell = (cell: models.ICell) => {
    this.setState(prevState => {

      const prevGameState = prevState.gameState
      let isCompleted = prevGameState.isCompleted
      if (isCompleted) {
        return prevState
      }

      const expectedSymbol = prevState.table.expectedSequence[prevGameState.expectedSymbolIndex]
      const correct = cell.text === expectedSymbol
      let expectedSymbolIndex = prevGameState.expectedSymbolIndex
      let duration = prevGameState.duration
      const userSequence = [...prevGameState.userSequence, {
        correct,
        time: new Date(),
        cell
      }]

      if (correct) {
        if (expectedSymbolIndex === prevState.table.expectedSequence.length - 1) {
          isCompleted = true
          const endTime = new Date()
          duration = endTime.getTime() - prevGameState.startTime.getTime()
          const gameTypeSelected = this.state.gameTypes.find(t => t.id === this.state.gameTypeIdSelected)!
          const { width, height, ...gameOptions } = gameTypeSelected.value

          const scoreRequest: models.IScoreRequest = {
            duration,
            endTime,
            expectedSequence: prevState.table.expectedSequence,
            // TODO: API should accept cells so we can do analysis on harder arangement of numbers
            randomizedSequence: prevState.table.cells.map(c => c.text),
            signedStartTime: prevState.signedStartTime!,
            startTime: prevState.gameState.startTime,
            tableHeight: height,
            tableProperties: Object.entries(gameOptions).map(([key, value]) => ({ key, value })),
            tableWidth: width,
            userSequence
          }

          const { id, name } = this.props.user
          this.props.addScoreThunkAsync(scoreRequest, { id, name })
        }
        expectedSymbolIndex += 1
      }

      if (!correct) {
        this.playBuzzerSound()
      }

      return {
        ...prevState,
        gameState: {
          ...prevGameState,
          duration,
          expectedSymbolIndex,
          isCompleted,
          userSequence: userSequence,
        }
      }
    })
  }

  playBuzzerSound() {
    const oscillator = this.audio.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.value = 300
    oscillator.connect(this.audio.destination)
    oscillator.start(0)

    setTimeout(() => {
      oscillator.stop()
    }, 100)

    return oscillator;
  }

  render() {
    return (
      <div className="home-page">
        <h1>Pick a game type below:</h1>

        {!this.state.isGameVisible
          && <div className="game-types">
            {this.state.gameTypes.map(gameType =>
              <GameType
                key={gameType.id}
                gameType={gameType}
                onClick={() => this.onClickStart(gameType)}
              />)}
          </div>}

        {this.state.isGameVisible
          && <div className="game-container">
            <Game
              width={this.state.table.width}
              height={this.state.table.height}
              table={this.state.table}
              gameState={this.state.gameState}
              onClickClose={this.onClickCloseGame}
              onClickCell={this.onClickCell}
            />
          </div>}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    startScoreThunkAsync,
    addScoreThunkAsync
  },
    dispatch)
}
const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.user
  }
}

// Props types inferred from mapStateToProps & dispatchToProps
type stateProps = ReturnType<typeof mapStateToProps>
type dispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = stateProps & dispatchProps

export default connect<stateProps, dispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Home)