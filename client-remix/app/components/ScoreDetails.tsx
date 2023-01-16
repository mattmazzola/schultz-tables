import React from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ICell, IScore, ITable } from '~/types/models'
import { getTimeDifference } from '../utilities'
import GamePreview from './GamePreview'

interface Props {
    scoreDetails: IScore
}

const ScoreDetails: React.FC<Props> = (props) => {
    const { scoreDetails } = props
    const gameStartTime = new Date(scoreDetails.startTime).valueOf()
    const { tableLayout, tableType } = scoreDetails
    const data = scoreDetails.sequence
        .filter(s => s.correct)
        .map(s => ({
            name: s.cell.text,
            time: getTimeDifference(s.time, gameStartTime)
        }))

    const horizontalTicks = tableLayout.expectedSequence
    const maxYAxis = Math.ceil(scoreDetails.durationMilliseconds / 1000) + 1
    const verticalTicks = Array(maxYAxis).fill(0).map((_, i) => i * 1000)
    const tableForPreview: ITable = {
        classes: [],
        width: tableLayout.width,
        height: tableLayout.height,
        expectedSequence: tableLayout.expectedSequence,
        cells: (tableLayout.randomizedSequence ?? []).reduce<ICell[]>((cells, symbol, i, seq) => {
            return [
                ...cells,
                {
                    classes: [],
                    text: symbol,
                    x: i,
                    y: i
                }]
        }, [])
    }

    return (
        <div className="score-details">
            <dl>
                <dt><span className="material-symbols-outlined">border_all</span> Size:</dt>
                <dd>{tableLayout.width}w &times; {tableLayout.height}h</dd>
                <dt><span className="material-symbols-outlined">format_list_bulleted</span> Properties:</dt>
                <dd>
                    <dl>
                        {(tableType.properties ?? []).map(({ key, value }) =>
                            <React.Fragment key={key}>
                                <dt>{key}:</dt>
                                <dd>{value}</dd>
                            </React.Fragment>
                        )}
                    </dl>
                </dd>
                <dt><span className="material-symbols-outlined">access_time</span> Start Time:</dt>
                <dd suppressHydrationWarning>{new Date(scoreDetails.startTime).toLocaleDateString('en-us', {
                    hour: '2-digit',
                    hour12: true,
                    minute: "2-digit",
                    second: '2-digit',
                })}</dd>
                <dt><span className="material-symbols-outlined">access_time</span> End Time:</dt>
                <dd suppressHydrationWarning>{new Date(scoreDetails.endTime).toLocaleDateString('en-us', {
                    hour: '2-digit',
                    hour12: true,
                    minute: "2-digit",
                    second: '2-digit',

                })}</dd>
                <dt><span className="material-symbols-outlined">format_list_numbered</span> Sequence</dt>
                <dd>
                    <div className="sequence">
                        <div className="heading">
                            <span className="material-symbols-outlined">playlist_add_check</span>
                        </div>
                        <div className="heading">
                            <span className="material-symbols-outlined">translate</span>
                        </div>
                        <div className="heading">
                            <span className="material-symbols-outlined">access_time</span>
                        </div>
                        <div className="heading">
                            <span className="material-symbols-outlined">access_time</span>
                        </div>

                        {scoreDetails.sequence.map((o, i, seq) => {
                            const totalDuration = getTimeDifference(o.time, gameStartTime)
                            const previousActionTime = i === 0
                                ? gameStartTime
                                : seq[i - 1].time
                            const timeSincePreviousAction = getTimeDifference(o.time, previousActionTime)

                            return (
                                <React.Fragment key={o.time as any}>
                                    <div>
                                        {o.correct
                                            ? <span className="material-symbols-outlined correct">done</span>
                                            : <span className="material-symbols-outlined incorrect">error_outline</span>}
                                    </div>
                                    <div className="text-center">{o.cell.text}</div>
                                    <div>+ {timeSincePreviousAction} ms</div>
                                    <div className="text-right">{(totalDuration / 1000).toFixed(3)} sec</div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </dd>
                <dt className="no-chart-mobile">Timeline:</dt>
                <dd className="no-chart-mobile">
                    <LineChart
                        id={`score-${scoreDetails.id}`}
                        className="score-details__line-chart"
                        width={500}
                        height={500}
                        data={data}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                        <Line type="monotone" dataKey="time" stroke="#8884d8" />
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis padding={{ right: 20 }} dataKey="name" ticks={horizontalTicks} interval={0} />
                        <YAxis padding={{ top: 20 }} ticks={verticalTicks} tickFormatter={t => `${t / 1000}`} interval={0} />
                        <Tooltip />
                    </LineChart>
                </dd>
                <dt className="game-preview">Game:</dt>
                <dd>
                    <GamePreview table={tableForPreview} />
                </dd>
            </dl>
        </div>
    )
}

export default ScoreDetails