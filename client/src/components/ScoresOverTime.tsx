import React from 'react'
import * as models from '../types/models'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import './ScoresOverTime.css'

interface Props {
    scores: models.IScore[]
}

export const ScoresOverTime: React.FC<Props> = ({ scores }) => {
    const data = scores
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .map<any>(s => {
            const start = new Date(s.startTime)
            const name = `${start.getMonth()}-${start.getDate()}`
            return { name, time: s.durationMilliseconds / 1000 }
        })

    return (
        <div className="scores-over-time">
            <LineChart className="scores-over-time__line-chart" width={450} height={400} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} >
                <Line type="monotone" dataKey="time" stroke="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis dataKey="time" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
            </LineChart>
        </div>
    )
}

export default ScoresOverTime