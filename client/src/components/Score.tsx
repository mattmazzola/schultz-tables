import * as React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getScoreDetailsThunkAsync } from '../actions/scoresActions'
import { ReduxState } from '../types'
import * as models from '../types/models'
import * as moment from 'moment'
import ScoreDetails from './ScoreDetails'
import './Score.css'

interface ReceivedProps {
    score: models.IScore
}

interface State {
    scoreDetails: models.IScore | null
    isDetailsVisible: boolean
    isDetailsLoading: boolean
}

const initialState: State = {
    scoreDetails: null,
    isDetailsVisible: false,
    isDetailsLoading: false
}

class Score extends React.Component<Props, State> {
    state = initialState

    async onClickScore(score: models.IScore) {
        this.setState(prevState => ({
            isDetailsVisible: !prevState.isDetailsVisible
        }))

        // If score details are already loaded, return
        if (this.state.scoreDetails) {
            return
        }

        this.setState({
            isDetailsLoading: true
        })
        const getScoreDetails: (id: string) => Promise<models.IGraphQlResponse<{ score: models.IScore }>> = this.props.getScoreDetailsThunkAsync as any
        const json = await getScoreDetails(score.id)

        const scoreDetails = json.data.score

        this.setState({
            scoreDetails,
            isDetailsLoading: false
        })
    }

    render() {
        const { score } = this.props
        return (
            <div className="score">
                <div className="score-preview" onClick={() => this.onClickScore(score)}>
                    <span className="score-preview__start-time">{moment(score.startTime).format('lll')}</span>
                    <span className="score-preview__duration">{moment.duration(score.durationMilliseconds).asSeconds()}</span>
                    <span>{score.user ? score.user.name : 'Unknown'}</span>
                    <span className="score-preview__icon">
                        {this.state.isDetailsVisible
                            ? <i className="material-icons">keyboard_arrow_up</i>
                            : <i className="material-icons">keyboard_arrow_down</i>}
                    </span>
                </div>
                {this.state.isDetailsVisible
                    && <div className="score-details">
                        {this.state.isDetailsLoading
                            ? <div>Loading....</div>
                            : <div>{this.state.scoreDetails && <ScoreDetails durationMilliseconds={score.durationMilliseconds} scoreDetails={this.state.scoreDetails} />}</div>
                        }</div>}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getScoreDetailsThunkAsync
    }, dispatch)
}
const mapStateToProps = (state: ReduxState) => {
    return {
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
type stateProps = ReturnType<typeof mapStateToProps>
type dispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = stateProps & dispatchProps & ReceivedProps

export default connect<stateProps, dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(Score)