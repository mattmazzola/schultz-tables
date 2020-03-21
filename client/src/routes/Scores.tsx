import * as React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTableTypesThunkAsync, getScoresThunkAsync } from '../actions/scoresActions'
import { ReduxState } from '../types'
import Score from '../components/Score'
import './Scores.css'

const component: React.FC<Props> = (props) => {
  const [tableTypeIdSelected, setTableTypeId] = React.useState('')

  // Fetch table types when mounted
  React.useEffect(() => {
    props.getTableTypesThunkAsync()
  }, [])

  // Anytime table types change reset selected to first
  React.useEffect(() => {
    if (props.scores.tableTypes.length > 0) {
      setTableTypeId(props.scores.tableTypes[0].id)
    }
  }, [props.scores.tableTypes.length])

  // Load scores for selected table type
  React.useEffect(() => {
    if (tableTypeIdSelected.length > 0) {
      getScoresThunkAsync(tableTypeIdSelected)
    }
  }, [tableTypeIdSelected])


  const onChangeTableType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tableTypeIdSelected = event.target.value

    const existingScores = props.scores.scoresByType[tableTypeIdSelected]
    if (!Array.isArray(existingScores) || existingScores.length === 0) {
      props.getScoresThunkAsync(tableTypeIdSelected)
    }

    setTableTypeId(tableTypeIdSelected)
  }

  const onClickRefresh = () => {
    props.getTableTypesThunkAsync()
    props.getScoresThunkAsync(tableTypeIdSelected)
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
                {scoresByType!.scores.map(score => <Score key={score.id} score={score} />)}
              </div>}
        </div>
        <div>
          {scoresByType && scoresByType!.continuationToken !== null && <button className="scores-loadmore-button" onClick={() => onClickLoadMore(scoresByType.continuationToken!)}><i className="material-icons">file_download</i> Load More</button>}
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    getTableTypesThunkAsync,
    getScoresThunkAsync
  }, dispatch)
}
const mapStateToProps = (state: ReduxState) => {
  return {
    scores: state.scores
  }
}

// Props types inferred from mapStateToProps & dispatchToProps
type stateProps = ReturnType<typeof mapStateToProps>
type dispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = stateProps & dispatchProps

export default connect<stateProps, dispatchProps, {}>(mapStateToProps, mapDispatchToProps)(component)