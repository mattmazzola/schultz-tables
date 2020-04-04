import * as utilities from '../../utilities'
import { ApolloError } from 'apollo-server'
import uuid from 'uuid/v4'
import * as types from '../../generated/types'
import stringify from 'json-stable-stringify'
import auth0ManagementClient from "../../services/auth0service"

// const Query = {
const Query: types.QueryResolvers.Resolvers = {
    userScores: async (_, { userId }, context, info) => {
        const cursor = await context.scores.find({ userId })
        const scores = await cursor.toArray()

        return scores
    },
    score: async (_, { id }, context, info) => {
        const score = await context.scores.findOne({ id })
        if (!score) {
            throw new Error(`Could not find score by id: ${id}`)
        }

        const tableType = await context.tableTypes.findOne({ id: score.tableTypeId })
        const tableLayout = await context.tableLayouts.findOne({ id: score.tableLayoutId })

        const anyScore = score as any
        anyScore.tableType = tableType
        anyScore.tableLayout = tableLayout

        return anyScore
    },
    scores: async (_, { tableTypeId, page = 1 }, context, info) => {
        const scores = await context.scores
            // .find({ $query: { tableTypeId }, $orderby: { durationMilliseconds: 1 } })
            .find()
            .skip((page! - 1) * 50)
            // .limit(50)
            .sort({ startTime: 1 })
            .toArray()

        if (scores.length === 0) {
            return {
                scores: [],
                users: []
            }
        }

        const userIds = [... new Set(scores.map(s => s.userId))] as string[]
        const query = userIds.map(id => `user_id:${id}`).join(` OR `)
        const rawUsers = await auth0ManagementClient.getUsers({ q: query })
        const users = rawUsers.map<types.User>(user => {
            return {
                id: user.user_id ?? 'unknown',
                email: user.email ?? 'unknown',
                name: user.name ?? 'unknown',
            }
        })

        return {
            scores,
            users
        }
    }
}

const Mutation: types.MutationResolvers.Resolvers = {
    start: () => {
        const now = Date.now().toString()
        const signedTime = utilities.encrypt(now)

        return {
            value: signedTime
        }
    },

    addScore: async (_, { scoreInput }, context) => {
        if (!scoreInput) {
            throw Error(`ScoreInput not defined`)
        }

        const signedStartTime = scoreInput.signedStartTime
        const startTime = Number(utilities.decrypt(signedStartTime))
        const allowedSkew = 2000 // 2 seconds

        const now = new Date().getTime()
        const endTime = scoreInput.userSequence[scoreInput.userSequence.length - 1].time
        const isTimeValid = utilities.isTimeValid(
            startTime,
            now,
            endTime,
            scoreInput,
            allowedSkew
        )

        if (!isTimeValid) {
            throw new ApolloError(`You have been logged for attempted cheating.  Your account will be reviewed and may be deleted.`)
        }

        const tableLayout: types.TableLayout = {
            width: scoreInput.tableWidth,
            height: scoreInput.tableHeight,
            expectedSequence: scoreInput.expectedSequence,
            randomizedSequence: scoreInput.randomizedSequence,
            id: null!
        }

        const tableType: types.TableType = {
            width: scoreInput.tableWidth,
            height: scoreInput.tableHeight,
            properties: scoreInput.tableProperties.sort((a, b) => a.key.localeCompare(b.key)),
            id: null!
        }

        const tableLayoutString = stringify(tableLayout)
        tableLayout.id = utilities.sha256(tableLayoutString)

        const tableTypeString = stringify(tableType)
        tableType.id = utilities.sha256(tableTypeString)

        const score: types.Score = {
            id: uuid(),
            sequence: scoreInput.userSequence,
            tableLayoutId: tableLayout.id,
            tableTypeId: tableType.id,
            startTime: scoreInput.startTime,
            endTime,
            duration: endTime - scoreInput.startTime,
            durationMilliseconds: endTime - scoreInput.startTime,
            userId: scoreInput.userId
        }

        const tableLayoutResult = await context.tableLayouts.insertOne(tableLayout)
        const tableTypeResult = await context.tableTypes.updateOne({ id: tableType.id }, { $set: tableType }, { upsert: true })
        const result = await context.scores.insertOne(score)

        return score
    },
}

export default {
    Query,
    Mutation
}