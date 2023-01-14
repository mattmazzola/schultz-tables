import * as React from 'react'
import { gameTypeIdToSequence } from '~/constants/randomSymbols'
import * as models from '~/types/models'
import * as utilities from '~/utilities'

interface Props {
    gameType: models.IOption<models.ITableConfig>
}

export const GameType: React.FC<Props> = ({ gameType }) => {
    const sequence = gameTypeIdToSequence[gameType.id]
    const table = utilities.generateTable(gameType.value, sequence)
    const useMargin = table.classes.length > 0

    return <div
        role="button"
        key={gameType.id}
        className="game-type"
    >
        <div className="game-type__title">{gameType.name.split(' - ').at(0)}<br />{gameType.name.split(' - ').at(1)}</div>
        <div className={`game-type-grid ${table.classes.join(' ')}`} style={{ gridTemplate: `repeat(${table.width}, 1fr) / repeat(${table.height}, 1fr)`, margin: useMargin ? '1em' : '0' }}>
            {table.cells.map((cell, i) =>
                <div key={i} className={`game-type-grid__cell ${cell.classes.join(' ')}`}>
                    {cell.text}
                </div>
            )}
        </div>
    </div>
}
