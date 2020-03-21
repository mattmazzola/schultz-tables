import * as React from 'react'
import * as models from '../types/models'
import './GamePreview.css'

interface Props {
    table: models.ITable
}

const Game: React.FC<Props> = ({ table }) => {
    return (
        <div className="game-preview">
            <div className="game-preview-content table-preview" style={{ gridTemplate: `repeat(${table.width}, 1fr) / repeat(${table.height}, 1fr)` }}>
                {table.cells.map((cell, i) =>
                    <div key={i} className={`table-preview__cell ${cell.classes.join(' ')}`}>
                        {cell.text}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Game
