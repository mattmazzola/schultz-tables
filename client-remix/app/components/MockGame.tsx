import * as React from 'react'
import { getSymbols, randomize } from '../utilities'

const Game: React.FC = () => {
    const width = 5
    const [symbols] = React.useState(() => randomize(getSymbols('number', width * width)))

    return (
        <div className="mock-table">
            {symbols.map((s, i) =>
                <div key={i} className="mock-table__cell">
                    {s}
                </div>
            )}
        </div>
    )
}

export default Game
