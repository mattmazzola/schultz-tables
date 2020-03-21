import mongo from 'mongodb'
import * as types from '../generated/types'

export interface IContext {
    db: mongo.Db,
    scores: mongo.Collection<types.Score>
    tableTypes: mongo.Collection<types.TableType>
    tableLayouts: mongo.Collection<types.TableLayout>
    user: any
}