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