import * as React from 'react'
import * as models from '../types/models'
import './Game.css'

interface Position {
    top: number
    bottom: number
    left: number
    right: number
    width: string
    height: string
}

interface Props {
    width: number
    height: number
    table: models.ITable
    gameState: models.IGameState
    onClickClose: () => void
    onClickCell: (cell: models.ICell) => void
}

interface State {
    position: Position
    chosenSequence: models.IChosenCell[]
}

const initialState: State = {
    position: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: `100px`,
        height: `100px`
    },
    chosenSequence: []
}

export default class Game extends React.Component<Props, State> {
    state = initialState
    element: HTMLElement

    constructor(props: Props) {
        super(props)

        this.state.chosenSequence = props.table.expectedSequence.map((s, i) => ({
            text: s,
            used: false,
            current: i === 0
        }))
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize)
    }

    componentDidMount() {
        this.computeTablePosition()
    }

    componentWillReceiveProps(nextProps: Props) {
        const chosenSequence = nextProps.table.expectedSequence.map((s, i) => ({
            text: s,
            used: i < nextProps.gameState.expectedSymbolIndex,
            current: i === nextProps.gameState.expectedSymbolIndex
        }))

        this.setState({
            chosenSequence
        })
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize)
    }

    onRef = (element: HTMLElement | null) => {
        if (element) {
            this.element = element
        }
    }

    onResize = (event: UIEvent) => {
        this.computeTablePosition()
    }

    private computeTablePosition() {
        const rect = this.element.getBoundingClientRect();
        const maxSize = Math.min(rect.width, rect.height)
        const horizontalCenter = (rect.right - rect.left) / 2
        const left = horizontalCenter - (maxSize / 2)
        const verticalCenter = (rect.bottom - rect.top) / 2
        const top = verticalCenter - (maxSize / 2)

        const position: Position = {
            left,
            right: left + maxSize,
            top,
            bottom: top + maxSize,
            width: `${maxSize}px`,
            height: `${maxSize}px`
        }

        this.setState({
            position
        })
    }

    render() {
        const tableStyle: any = {
            ...this.state.position,
            gridTemplate: `repeat(${this.props.width}, 1fr)/repeat(${this.props.height}, 1fr)`
        }

        return (
            <div className="game">
                <header className="game__header">
                    <div>
                        {this.props.gameState.isCompleted ? `Finished ${this.props.gameState.duration / 1000}` : ''}
                    </div>
                    <button className={`button-close ${this.props.gameState.isCompleted ? 'button-close--completed' : ''}`} type="button" onClick={() => this.props.onClickClose()}><i className="icon-close material-icons">clear</i></button>
                </header>
                <div className="game__table" ref={this.onRef}>
                    <div className={`table ${this.props.table.classes.join(' ')}`} style={tableStyle}>
                        {this.props.table.cells.map((cell, i) =>
                            <div key={i} className={`table__cell ${cell.classes.join(' ')}`} onClick={() => this.props.onClickCell(cell)}>
                                {cell.text}
                            </div>
                        )}
                    </div>
                </div>
                <footer className="game__footer">
                    {this.state.chosenSequence.map((symbol, i) =>
                        <div className={`game-symbol ${symbol.used ? 'game-symbol--used': ''} ${symbol.current ? 'game-symbol--current': ''}`} key={i}>{symbol.text}</div>
                    )}
                </footer>
            </div>
        );
    }
}
