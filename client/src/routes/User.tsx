import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import * as models from '../types/models'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, getTableTypesThunkAsync, getUserScoresThunkAsync } from '../actions'
import { ReduxState } from '../types'
import Score from '../components/Score'
import { NavLink } from 'react-router-dom'
import './User.css'
import { getUserTableTypeKey } from '../services/utilities';
import ScoresOverTime from '../components/ScoresOverTime'

interface ReceivedProps extends RouteComponentProps<any> {
}

const component: React.FC<Props> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [tableTypeIdSelected, setTableTypeId] = React.useState('')
    const [user, setUser] = React.useState<models.IUser>()

    React.useEffect(() => {
        const { history, location } = props
        const user: models.IUser | null = location.state && location.state.user

        if (!user) {
            history.replace('/')
            return
        }

        setUser(user)
    }, [])

    React.useEffect(() => {
        if (props.profile.tableTypes.length === 0) {
            setIsLoading(true)
            props.getTableTypesThunkAsync()
        }
        else {
            setIsLoading(false)
            setTableTypeId(props.profile.tableTypes[0].id)
        }
    }, [props.profile.tableTypes.length])

    React.useEffect(() => {
        if (!props.profile.scoresByUserAndType[tableTypeIdSelected] && user) {
            props.getUserScoresThunkAsync(tableTypeIdSelected, user)
        }
    }, [user, props.profile.scoresByUserAndType[tableTypeIdSelected]])

    const onChangeTableType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tableTypeIdSelected = event.target.value
        if (!user) {
            return
        }

        const key = getUserTableTypeKey(user.id, tableTypeIdSelected)
        const existingUserScores = props.profile.scoresByUserAndType[key]
        if (!existingUserScores || existingUserScores.length === 0) {
            props.getUserScoresThunkAsync(tableTypeIdSelected, user)
        }

        setTableTypeId(tableTypeIdSelected)
    }

    const onClickLogout = () => {
        props.logout()
    }

    const { user: loggedInUser, profile } = props
    const userTableKey = user && getUserTableTypeKey(user.id, tableTypeIdSelected)
    const scoresResponse = userTableKey ? profile.scoresByUserAndType[userTableKey] : undefined
    const hasScores = scoresResponse && scoresResponse.length > 1

    return (
        <div className="user-page">
            <h1>{user ? user.name : 'Uknown'}</h1>
            {loggedInUser && user && loggedInUser.id === user.id
                ? <div>
                    <button className="button-logout" type="button" onClick={onClickLogout}>Logout</button>
                </div>
                : <NavLink className="link" to="/users" exact={true}>
                    Back
                </NavLink>}
            <h2>User Scores</h2>
            <div className="scores-types">
                {props.profile.tableTypes.length === 0
                    ? <div>Loading...</div>
                    : <select onChange={onChangeTableType} value={tableTypeIdSelected}>
                        {props.profile.tableTypes.map((tableType, i) =>
                            <option key={`${i}_${tableType.id}`} value={tableType.id}>{tableType.width} x {tableType.height} - {tableType.properties
                                .filter(({ key }) => ['symbols', 'fontColor', 'cellColor'].includes(key))
                                .map(({ value }) => `${value}`)
                                .join(', ')}
                            </option>
                        )}
                    </select>}
            </div>
            {isLoading
                ? <div className="score-loading">Loading...</div>
                : (!hasScores || !scoresResponse)
                    ? <div>No scores for this user on this type of table</div>
                    : <React.Fragment>
                        <ScoresOverTime scores={scoresResponse} />
                        <div className="scores">{scoresResponse.map(score => <Score key={score.id} score={score} />)}</div>
                    </React.Fragment>
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        logout,
        getTableTypesThunkAsync,
        getUserScoresThunkAsync
    }, dispatch)
}
const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user,
        profile: state.profile
    }
}

type stateProps = ReturnType<typeof mapStateToProps>
type dispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = stateProps & dispatchProps & ReceivedProps & RouteComponentProps<any>

export default connect<stateProps, dispatchProps, ReceivedProps & RouteComponentProps<any>>(mapStateToProps, mapDispatchToProps)(component)