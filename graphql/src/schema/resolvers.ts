import merge from 'lodash/merge'
import score from './scores/resolvers'
import users from './users/resolvers'
import tableTypes from './tableTypes/resolvers'
import tableLayouts from './tableLayouts/resolvers'

const resolvers = merge(
    score,
    users,
    tableTypes,
    tableLayouts,
)

export default resolvers