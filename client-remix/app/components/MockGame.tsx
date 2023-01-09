import * as React from 'react'
import { randomSymbols } from "~/constants/randomSymbols"

type Props = {
    index: number
}

const Game: React.FC<Props> = ({ index, }) => {
    const symbols = randomSymbols[index % randomSymbols.length]

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
