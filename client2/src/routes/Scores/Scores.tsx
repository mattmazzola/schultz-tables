import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import * as models from "../../types/models"
import * as options from '../../utilities/options'
import * as Auth0 from "../../react-auth0-spa"
import Score from '../../components/Score'
import './Scores.css'
import styles from './Scores.module.css'
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

    const onClickLoadMore = (option: models.IOption<models.ITableConfig>, continuationToken: string) => {
        if (!option || !continuationToken) {
            console.error(`Error attempting to load more scores for type. A type and continuation token must be provided.`)
            return
        }

        console.log(`You loaded more scores for type ${option.name} ${option.id}. Continuation Token: ${continuationToken}`)
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
            <h2>Scores by Table Type:</h2>

            <div className={styles.scoresColummns}>
                {options.presetTables.map(option => {
                    const scoresByType = props.scoresByType[option.id]
                    return (
                        <div key={option.id} className={styles.scoreColumn}>
                            <div>{option.name}</div>
                            <div>
                                {(scoresByType?.scores ?? []).map(s => {
                                    return (
                                        <div key={s.id}>
                                            <div>{moment(s.startTime).format('lll')}</div>
                                            <div>{moment(s.endTime).format('lll')}</div>
                                            <div>{s.durationMilliseconds}</div>
                                            <div>{s.user ? s.user.name : s.userId}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <button disabled={scoresByType?.continuationToken == null} onClick={() => scoresByType.continuationToken && onClickLoadMore(option, scoresByType.continuationToken)}>Load More</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

const ScoresContainer: React.FC = () => {
    const scoresState = useSelector(selectScores)
    const dispatch = useDispatch()
    const { getTokenSilently } = Auth0.useAuth0()

    React.useEffect(() => {
        async function fn(tableTypeId: string) {
            const token = await getTokenSilently()
            dispatch(getScoresAsync(token, tableTypeId))
        }

        options.presetTables.forEach(option => {
            if (scoresState.scoresByType[option.id] === undefined) {
                fn(option.id)
            }
        })
    }, [])

    const getScoresByType = async (tableTypeId: string, page: number = 1) => {
        const token = await getTokenSilently()
        dispatch(getScoresAsync(token, tableTypeId))
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