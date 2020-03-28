import React from "react"
import * as models from "../../types/models"
import Score from '../../components/Score'
import './Scores.css'

const props: {
    scores: {
        tableTypes: models.ITableType[],
        scoresByType: { [x: string]: models.IScoresResponse }
    }
} = {
    scores: {
        tableTypes: [],
        scoresByType: {
            tableTypeId: {
                scores: [],
                users: [],
                continuationToken: '',
            }
        }
    }
}

const Scores: React.FC = () => {

    const [tableTypeIdSelected, setTableTypeId] = React.useState('')

    const onChangeTableType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tableTypeIdSelected = event.target.value

        const existingScores = props.scores.scoresByType[tableTypeIdSelected]
        if (!Array.isArray(existingScores) || existingScores.length === 0) {
            //props.getScoresThunkAsync(tableTypeIdSelected)
        }

        setTableTypeId(tableTypeIdSelected)
    }

    const onClickRefresh = () => {
        // props.getTableTypesThunkAsync()
        // props.getScoresThunkAsync(tableTypeIdSelected)
    }

    const onClickLoadMore = (continuationToken: string) => {
        if (continuationToken !== null) {
            console.log('onClick Load more', continuationToken)
        }
    }

    const scoresByType = props.scores.scoresByType[tableTypeIdSelected]
    console.log({ tableTypeIdSelected, scoresByType })

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

            <div className="scores-page">
                <div className="scores-types">
                    {props.scores.tableTypes.length === 0
                        ? <div>Loading...</div>
                        : <select onChange={onChangeTableType} value={tableTypeIdSelected}>
                            {props.scores.tableTypes.map(tableType =>
                                <option key={tableType.id} value={tableType.id}>{tableType.width} x {tableType.height} - {tableType.properties
                                    .filter(({ key }) => ['symbols', 'fontColor', 'cellColor'].includes(key))
                                    .map(({ value }) => `${value}`)
                                    .join(', ')}
                                </option>
                            )}
                        </select>}
                </div>
                <div className="score-refresh-container">
                    <button className="score-refresh-button" onClick={onClickRefresh} disabled={tableTypeIdSelected === null}><i className="material-icons">refresh</i> Refresh</button>
                </div>
                <div className="scores">
                    {tableTypeIdSelected === ''
                        ? <div className="score-loading">Loading...</div>
                        : !scoresByType
                            ? <div className="score-loading">No scores for this table type</div>
                            : <div>
                                {scoresByType.scores.map(score => <Score key={score.id} score={score} />)}
                            </div>}
                </div>
                <div>
                    {scoresByType && scoresByType!.continuationToken !== null && <button className="scores-loadmore-button" onClick={() => onClickLoadMore(scoresByType.continuationToken!)}><i className="material-icons">file_download</i> Load More</button>}
                </div>
            </div>
        </>
    )
}

export default Scores