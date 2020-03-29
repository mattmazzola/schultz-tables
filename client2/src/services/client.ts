import * as graphql from './graphql'
import * as models from '../types/models'

export async function start(token: string) {
    const response = await graphql.makeGraphqlRequest(
        "start",
        `mutation start {
            start (ignored: "") {
                value
            }
        }`,
        token)

    if (!response.ok) {
        console.log(`status test: `, response.statusText)
        const text = await response.text()
        throw new Error(text)
    }

    const json: models.IGraphQlResponse<{ start: models.IStartScoreResponse }> = await response.json()
    if (json.errors && json.errors.length >= 1) {
        throw new Error(json.errors[0].message)
    }

    const signedStartTime = json.data.start.value

    return signedStartTime
}

export async function addScore(token: string, userId: string, scoreReqeust: models.IScoreRequest) {
    let tableProperties = JSON.stringify(scoreReqeust.tableProperties)
    tableProperties = tableProperties.replace(/\"([^(\")"]+)\":/g, "$1:")

    let userSequence = JSON.stringify(scoreReqeust.userSequence)
    userSequence = userSequence.replace(/\"([^(\")"]+)\":/g, "$1:")

    const response = await graphql.makeGraphqlMutation(
        "AddScore",
        `mutation AddScore {
            addScore (scoreInput: {
                signedStartTime: "${scoreReqeust.signedStartTime}",
                userId: "${userId}",
                startTime: ${scoreReqeust.startTime},
                expectedSequence: ${JSON.stringify(scoreReqeust.expectedSequence)}
                randomizedSequence: ${JSON.stringify(scoreReqeust.randomizedSequence)},
                userSequence: ${userSequence},
                tableWidth: ${scoreReqeust.tableWidth},
                tableHeight: ${scoreReqeust.tableWidth},
                tableProperties: ${tableProperties}
            }) {
                id
                startTime
                endTime
                duration
                durationMilliseconds
                sequence {
                    time
                    cell {
                        classes
                        text
                        x
                        y
                    }
                    correct
                }
                tableTypeId
                tableLayoutId
            }
        }
    `, token)

    if (!response.ok) {
        console.log(`status test: `, response.statusText)
        const text = await response.text()
        throw new Error(text)
    }

    const json: models.IGraphQlResponse<{ addScore: models.IScoreGraphql }> = await response.json()
    if (json.errors && json.errors.length >= 1) {
        throw new Error(json.errors[0].message)
    }

    const score = json.data.addScore
    console.log(`Score Added: `, score)
}