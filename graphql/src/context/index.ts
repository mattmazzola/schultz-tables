import mongo from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import * as types from '../generated/types'
import * as models from './models'
import { IContext } from './models'
import getDb from './db'
import { getJwt } from '../utilities'

// https://www.apollographql.com/docs/apollo-server/features/authentication.html
export const context = async ({ req }: { req: any }, db: mongo.Db, publicKey: string, options: { audience: string, issuer: string }, playgroundSecret?: string): Promise<IContext | Error> => {
    const authorization: string = req.headers.authorization
    let decodedJwt

    try {
        if (process.env.NODE_ENV === "test") {
            decodedJwt = {
                name: "Test environment"
            }
        }
        if (req.body.operationName === "IntrospectionQuery") {
            decodedJwt = {
                name: "Graph QL Playground"
            }
        }
        else if (req.body.query.includes("IntrospectionQuery")) {
            decodedJwt = {
                name: "Development"
            }
        }
        else if (typeof playgroundSecret === 'string' &&  authorization === playgroundSecret) {
            decodedJwt = {
                name: "Super User"
            }
        }
        else {
            decodedJwt = await getJwt(authorization, publicKey, options)
        }
    }
    catch (e) {
        const error = e as Error
        throw new AuthenticationError(error.message)
    }

    try {
        const scores = db.collection<types.Score>('scores')
        const tableTypes = db.collection<types.TableType>('tabletypes')
        const tableLayouts = db.collection<types.TableLayout>('tablelayouts')

        return {
            db,
            scores,
            tableTypes,
            tableLayouts,
            user: decodedJwt
        }
    }
    catch (e) {
        const error = e as Error

        return error
    }
}

export {
    IContext,
    getDb,
    models
}

export default context