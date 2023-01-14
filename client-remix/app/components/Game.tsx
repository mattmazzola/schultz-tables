import produce from "immer"
import * as React from 'react'
import * as models from '../types/models'

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
        top: 0.5,
        left: 0.5,
        right: 0,
        bottom: 0,
        width: `200px`,
        height: `200px`
    },
    chosenSequence: []
}

enum ActionTypes {
    SetSequence = 'SetSequence',
    SetPosition = 'SetPosition'
}

type SetSequence = {
    type: ActionTypes.SetSequence,
    payload: models.IChosenCell[]
}

type SetPosition = {
    type: ActionTypes.SetPosition,
    payload: Position
}

type Action
    = SetSequence
    | SetPosition

const reducer: React.Reducer<State, Action> = produce((state, action) => {
    switch (action.type) {
        case ActionTypes.SetSequence: {
            state.chosenSequence = action.payload
            break
        }
        case ActionTypes.SetPosition: {
            state.position = action.payload
            break
        }
    }

    return state
})

const Game: React.FC<Props> = (props) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const elementRef = React.useRef<HTMLDivElement>(null)

    const onResize = React.useCallback((event: UIEvent) => computeTablePosition(), [])
    
    // Setup resize of game when window resizes
    React.useEffect(() => {
        // Needs footer to be drawn before computation works correctly.
        setTimeout(() => computeTablePosition())
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [onResize])

    // Update game footer to show progress
    React.useEffect(() => {
        const chosenSequence = props.table.expectedSequence.map((s, i) => ({
            text: s,
            used: i < props.gameState.expectedSymbolIndex,
            current: i === props.gameState.expectedSymbolIndex
        }))

        dispatch({
            type: ActionTypes.SetSequence,
            payload: chosenSequence,
        })
    }, [props.gameState.userSequence.length])

    const computeTablePosition = () => {
        if (!elementRef.current) {
            return
        }

        const rect = elementRef.current.getBoundingClientRect()
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

        dispatch({
            type: ActionTypes.SetPosition,
            payload: position,
        })
    }

    const tableStyle: any = {
        ...state.position,
        gridTemplate: `repeat(${props.width}, 1fr)/repeat(${props.height}, 1fr)`
    }

    return (
        <div className="game">
            <header className="game__header">
                <div>
                    {props.gameState.isCompleted ? `Finished ${props.gameState.duration / 1000}` : 'Play!'}
                </div>
                <button className={`button-close ${props.gameState.isCompleted ? 'button-close--completed' : ''}`} type="button" onClick={() => props.onClickClose()}><span className="material-symbols-outlined">clear</span></button>
            </header>
            <div className="game__table" ref={elementRef}>
                <div className={`table ${props.table.classes.join(' ')}`} style={tableStyle}>
                    {props.table.cells.map((cell, i) =>
                        <div key={i} className={`table__cell ${cell.classes.join(' ')}`} onClick={() => props.onClickCell(cell)}>
                            {cell.text}
                        </div>
                    )}
                </div>
            </div>
            <footer className="game__footer">
                {state.chosenSequence.map((symbol, i) =>
                    <div className={`game-symbol ${symbol.used ? 'game-symbol--used' : ''} ${symbol.current ? 'game-symbol--current' : ''}`} key={i}>{symbol.text}</div>
                )}
            </footer>
        </div>
    )
}

export default Game