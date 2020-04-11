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

export async function getUsers(token: string) {
    const response = await graphql.makeGraphqlRequest(
        'users',
        `query users {
            users {
                id
                email
                emailVerified
                name
                nickname
                picture
            }
        }`,
        token,
    )

    if (!response.ok) {
        console.log(`status test: `, response.statusText)
        const text = await response.text()
        throw new Error(text)
    }

    const json: models.IGraphQlResponse<{ users: models.IUser[] }> = await response.json()
    if (json.errors && json.errors.length >= 1) {
        throw new Error(json.errors[0].message)
    }

    return json.data.users
}

export async function addScore(token: string, userId: string, scoreRequest: models.IScoreRequest) {
    let tableProperties = JSON.stringify(scoreRequest.tableProperties)
    tableProperties = tableProperties.replace(/\"([^(\")"]+)\":/g, "$1:")

    let userSequence = JSON.stringify(scoreRequest.userSequence)
    userSequence = userSequence.replace(/\"([^(\")"]+)\":/g, "$1:")

    const response = await graphql.makeGraphqlRequest(
        "AddScore",
        `mutation AddScore {
            addScore (scoreInput: {
                signedStartTime: "${scoreRequest.signedStartTime}",
                userId: "${userId}",
                startTime: ${scoreRequest.startTime},
                expectedSequence: ${JSON.stringify(scoreRequest.expectedSequence)}
                randomizedSequence: ${JSON.stringify(scoreRequest.randomizedSequence)},
                userSequence: ${userSequence},
                tableWidth: ${scoreRequest.tableWidth},
                tableHeight: ${scoreRequest.tableHeight},
                tableProperties: ${tableProperties}
            }) {
                id
                startTime
                endTime
                durationMilliseconds
                userSequence {
                    time
                    cell {
                        classes
                        text
                        x
                        y
                    }
                    correct
                }
                tableProperties {
                    key
                    value
                }
                tableWidth
                tableHeight
                tableTypeId
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

export const getScoresThunkAsync = async (token: string, tableTypeId: string): Promise<models.IScoresResponse> => {
    const response = await graphql.makeGraphqlRequest(
        null,
        `{
            scores(tableTypeId: "${tableTypeId}") {
                users {
                    id
                    email
                    name
                }
                scores {
                    id
                    userId
                    startTime
                    endTime
                    durationMilliseconds
                    userSequence {
                        cell {
                            x
                            y
                            text
                        }
                        time
                        correct
                    }
                    tableWidth
                    tableHeight
                    tableProperties {
                        key
                        value
                    }
                    tableTypeId
                }
            }
        }`,
        token)

    if (!response.ok) {
        console.log(`status test: `, response.statusText)
        const text = await response.text()
        throw new Error(text)
    }

    const json: models.IGraphQlResponse<{ scores: models.IScoresResponse }> = await response.json()
    if (json.errors && json.errors.length >= 1) {
        throw new Error(json.errors[0].message)
    }

    json.data.scores.scores.forEach(score => {
        const user = json.data.scores.users.find(u => u.id === score.userId)
        score.user = user
    })

    return json.data.scores
}