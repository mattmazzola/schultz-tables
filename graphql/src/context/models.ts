import mongo from 'mongodb'
import * as types from '../generated/types'
import * as models from '../models'

export interface IContext {
    db: mongo.Db,
    scores: mongo.Collection<types.Score>
    user: models.IUser
}