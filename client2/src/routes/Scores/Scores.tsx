import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import * as models from "../../types/models"
import * as options from '../../utilities/options'
import * as Auth0 from "../../react-auth0-spa"
import Score from '../../components/Score'
import './Scores.css'
import styles from './Scores.module.css'
import { getScoresAsync, selectScores } from './scoresSlice'
import moment from "moment"
import { GameType } from "../../components/GameType"

type Props = {
    tableTypes: models.ITableType[],
    scoresByType: { [x: string]: models.IScoresResponse }

    getScoresByType: (tableTypeId: string) => void
}

const Scores: React.FC<Props> = (props) => {
    const onClickRefresh = (option: models.IOption<models.ITableConfig>, continuationToken: string) => {
        if (!option || !continuationToken) {
            console.error(`Error attempting to load more scores for type. A type and continuation token must be provided.`)
            return
        }

        console.log(`You loaded more scores for type ${option.name} ${option.id}. Continuation Token: ${continuationToken}`)
        props.getScoresByType(option.id)
    }

    return (
        <>
            <h2 className={styles.scoresHeader}>Scores by Table Type:</h2>

            <div className={styles.scoresColumns}>
                {options.presetTables.map(gameType => {
                    const scoresByType = props.scoresByType[gameType.id]
                    return (
                        <div key={gameType.id} className={styles.scoreColumn}>
                            <div className={styles.scoreColumn__header}>
                                <GameType
                                    key={gameType.id}
                                    gameType={gameType}
                                    onClick={() => {}}
                                />
                            </div>
                            <div>
                                {(scoresByType?.scores ?? []).map(s => {
                                    return (
                                        <div key={s.id} className={styles.score}>
                                            <div>⌚</div><div>{(s.durationMilliseconds / 1000).toFixed(2)} sec</div>
                                            <div>⏲</div><div>{moment(s.startTime).format('M/D hh:mm a')}</div>
                                            <div>🧑</div><div>{s.user ? (s.user.nickname ?? s.user.name ?? s.user.email) : s.userId}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.scoreRefreshButton}>
                                <button disabled={scoresByType == null} onClick={() => onClickRefresh(gameType, 'fakeContinuationToken')}>Refresh Top 50</button>
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