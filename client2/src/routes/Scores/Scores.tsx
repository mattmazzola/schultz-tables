import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import * as models from "../../types/models"
import * as Auth0 from "../../react-auth0-spa"
import Score from '../../components/Score'
import './Scores.css'
import { getScoresAsync, selectScores, getTableTypes } from './scoresSlice'
import moment from "moment"

type Props = {
    tableTypes: models.ITableType[],
    scoresByType: { [x: string]: models.IScoresResponse }

    getScoresByType: (tableTypeId: string) => void
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

    const onChangeTableType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tableTypeId = event.target.value
        props.getScoresByType(tableTypeId)
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

            <select onChange={onChangeTableType}>
                {props.tableTypes.map(tableType =>
                    <option value={tableType.id}>{JSON.stringify(tableType)}</option>
                )}
            </select>

            {Object.entries(props.scoresByType).map(([type, scores], i) => {
                return (
                    <div key={`${type}-${i}`}>
                        <div>{type}</div>
                        <div>
                            {scores.scores.map(s => {
                                return (
                                    <div key={s.id}>
                                        <div>{moment(s.startTime).format('ll')}</div>
                                        <div>{moment(s.endTime).format('ll')}</div>
                                        <div>{s.durationMilliseconds}</div>
                                        <div>{s.user ? s.user.name : s.userId}</div>
                                    </div>
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
    const { getTokenSilently } = Auth0.useAuth0()

    React.useEffect(() => {
        async function fn() {
            const token = await getTokenSilently()
            dispatch(getScoresAsync(token, 'asdfasdf'))
        }

        fn()
    }, [])

    const getScoresByType = async (tableTypeId: string, page: number = 1) => {
        const token = await getTokenSilently()
        dispatch(getScoresAsync(token, 'asdfasdf'))
    }

    return (
        <Scores
            scoresByType={scoresState.scoresByType}
            tableTypes={scoresState.tableTypes}
            getScoresByType={getScoresByType}
        />
    )
}

export default ScoresContainer