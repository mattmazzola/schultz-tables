import * as React from 'react'
import * as models from '~/types/models'

type Props = {
    score: models.IScore
}

const Score: React.FC<Props> = (props) => {
    const { score } = props
    return (
        <div className="score">
            <div className="score-preview">
                <span className="score-preview__start-time">{score.startTime}</span>
                <span className="score-preview__duration">{score.durationMilliseconds}</span>
                <span>{score.user ? score.user.name : 'Unknown'}</span>
            </div>
        </div>
    )
}

export default Score