import merge from 'lodash/merge'
import score from './scores/resolvers'
import users from './users/resolvers'

const resolvers = merge(
    score,
    users,
)

export default resolvers