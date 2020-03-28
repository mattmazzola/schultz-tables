import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import * as models from "../../types/models"
import Score from '../../components/Score'
import './Scores.css'
import { getScoresAsync, selectScores } from './scoresSlice'

type Props = {
    tableTypes: models.ITableType[],
    scoresByType: { [x: string]: models.IScoresResponse }
}

const Scores: React.FC<Props> = (props) => {
    const onClickRefresh = () => {
        // props.getTableTypesThunkAsync()
        // props.getScoresThunkAsync(tableTypeIdSelected)
    }

    const onClickLoadMore = (continuationToken: string) => {
        if (continuationToken !== null) {
            console.log('onClick Load more', continuationToken)
        }
    }

    const key = Object.keys(props.scoresByType)[0]
    const scoresOfType = props.scoresByType[key]
    console.log({ props })

    return (
        <>
            <div className="score-you">
                <div></div>
                <div>
                    4 x 4
            </div>
                <div>
                    5 x 5
            </div>
                <div>
                    5 x 5
            </div>
                <div>
                    6 x 6
            </div>

                <div>1</div>
                <div className="scores-grid__score">9.45 Matt Mazzola</div>
                <div className="scores-grid__score">24.3 Matt Mazzola</div>
                <div className="scores-grid__score">24.3 Matt Mazzola</div>
                <div className="scores-grid__score">24.3 Matt Mazzola</div>
            </div>

            <div className="scores-grid">
                <div>
                    #
            </div>
                <div className="scores-grid__table-types">
                    TableTypes:
            </div>

                <b></b>
                <div>
                    4 x 4
            </div>
                <div>
                    5 x 5
            </div>
                <div>
                    5 x 5
            </div>
                <div>
                    6 x 6
            </div>

                <div>1</div>
                <div className="scores-grid__container">
                    <div className="score-column">
                        <div className="score-column__score">24.3 Matt Mazzola</div>
                        <div className="score-column__score">24.3 Matt Mazzola</div>
                        <div className="score-column__score">24.3 Matt Mazzola</div>
                    </div>
                </div>

                <div>2</div>
                <div>3</div>
                <div>3</div>
                <div>3</div>
                <div>3</div>
                <div>3</div>

                {/* <div className="scores-grid__score">9.45 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div>
    
            <div>2</div>
            <div className="scores-grid__score">9.45 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div>
            <div className="scores-grid__score">24.3 Matt Mazzola</div> */}
            </div>

            {Object.entries(props.scoresByType).map(([type, scores], i) => {
                return (
                    <div key={`${type}-${i}`}>
                        <div>{type}</div>
                        <div>
                            {scores.scores.map(s => {
                                return (
                                    <div key={s.id}>{s.startTime}</div>
                                )
                            })}
                            <button>Load More</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const ScoresContainer: React.FC = () => {
    const scoresState = useSelector(selectScores)
    const dispatch = useDispatch()

    React.useEffect(() => {
        dispatch(getScoresAsync())
    }, [])

    return (
        <Scores
            scoresByType={scoresState.scoresByType}
            tableTypes={scoresState.tableTypes}
        />
    )
}

export default ScoresContainer