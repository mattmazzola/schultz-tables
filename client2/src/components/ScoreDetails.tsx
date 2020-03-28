import React from 'react'
import * as models from '../types/models'
import moment from 'moment'
import { getTimeDifference } from '../utilities'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import GamePreview from './GamePreview'
import './ScoreDetails.css'

interface Props {
    durationMilliseconds: number
    scoreDetails: models.IScore
}

const component: React.FC<Props> = (props) => {
        const { scoreDetails } = props
        const { tableLayout, tableType } = scoreDetails
        const data = scoreDetails.sequence
            .filter(s => s.correct)
            .map<any>(s => (
                { name: s.cell.text, time: getTimeDifference(s.time as any, scoreDetails.startTime as any) }
            ))

        const horizontalTicks = tableLayout.expectedSequence
        const maxYAxis = Math.ceil(props.durationMilliseconds / 1000) + 1
        const verticalTicks = Array(maxYAxis).fill(0).map((_, i) => i)
        const tableForPreview: models.ITable = {
            classes: [],
            width: tableLayout.width,
            height: tableLayout.height,
            expectedSequence: tableLayout.expectedSequence,
            cells: tableLayout.randomizedSequence.reduce<models.ICell[]>((cells, symbol, i, seq) => {
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
            <div>
                <dl>
                    <dt><i className="material-icons">border_all</i> Size:</dt>
                    <dd>{tableLayout.width}w &times; {tableLayout.height}h</dd>
                    <dt><i className="material-icons">format_list_bulleted</i> Properties:</dt>
                    <dd>
                        <dl>
                            {tableType.properties.map(({ key, value }) =>
                                <React.Fragment key={key}>
                                    <dt>{key}:</dt>
                                    <dd>{value}</dd>
                                </React.Fragment>
                            )}
                        </dl>
                    </dd>
                    <dt><i className="material-icons">access_time</i> Start Time:</dt>
                    <dd>{moment(scoreDetails.startTime).format('MMMM D, h:mm:ss a')}</dd>
                    <dt><i className="material-icons">access_time</i> End Time:</dt>
                    <dd>{moment(scoreDetails.endTime).format('MMMM D, h:mm:ss a')}</dd>
                    <dt><i className="material-icons">format_list_numbered</i> Sequence</dt>
                    <dd>
                        <div className="sequence">
                            <div className="heading">
                                <i className="material-icons">playlist_add_check</i>
                            </div>
                            <div className="heading">
                                <i className="material-icons">translate</i>
                            </div>
                            <div className="heading">
                                <i className="material-icons">access_time</i>
                            </div>
                            <div className="heading">
                                <i className="material-icons">access_time</i>
                            </div>

                            {scoreDetails.sequence.map((o, i, seq) => {
                                const totalDuration = getTimeDifference(o.time as any, scoreDetails.startTime as any)
                                const duration = i === 0
                                    ? getTimeDifference(o.time as any, scoreDetails.startTime as any)
                                    : getTimeDifference(o.time as any, seq[i - 1].time as any)


                                return (
                                    <React.Fragment key={o.time as any}>
                                        <div>
                                            {o.correct
                                                ? <i className="material-icons correct">done</i>
                                                : <i className="material-icons incorrect">error_outline</i>}
                                        </div>
                                        <div className="text-center">{o.cell.text}</div>
                                        <div>+{duration.toFixed(3)}</div>
                                        <div className="text-right">{totalDuration.toFixed(3)}</div>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </dd>
                    <dt className="no-chart-mobile">Timeline:</dt>
                    <dd className="no-chart-mobile">
                        <LineChart className="score-details__line-chart" width={450} height={400} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} >
                            <Line type="monotone" dataKey="time" stroke="#8884d8" />
                            <XAxis dataKey="name" ticks={horizontalTicks} interval={0} />
                            <YAxis dataKey="time" domain={[0, maxYAxis]} ticks={verticalTicks} />
                            <CartesianGrid strokeDasharray="3 3" />
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

export default component