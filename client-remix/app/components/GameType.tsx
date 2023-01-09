import * as React from 'react'
import * as models from '~/types/models'
import * as utilities from '~/utilities'

interface Props {
    gameType: models.IOption<models.ITableConfig>
    onClick: () => void
}

export const GameType: React.FC<Props> = ({ gameType, onClick }) => {
    const sequence = utilities.generateSymbols(gameType.value)
    const table = utilities.generateTable(gameType.value, sequence)
    const useMargin = table.classes.length > 0

    return <div
        role="button"
        key={gameType.id}
        className="game-type"
        onClick={onClick}
    >
        <div className="game-type__title">{gameType.name.split(' - ').at(0)}<br />{gameType.name.split(' - ').at(1)}</div>
        <div className={`game-type-grid ${table.classes.join(' ')}`} style={{ gridTemplate: `repeat(${table.width}, 1fr) / repeat(${table.height}, 1fr)`, margin: useMargin ? '1em' : '' }}>
            {table.cells.map((cell, i) =>
                <div key={i} className={`game-type-grid__cell ${cell.classes.join(' ')}`}>
                    {cell.text}
                </div>
            )}
        </div>
    </div>
}
