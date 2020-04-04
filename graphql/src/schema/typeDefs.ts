import global from './global/typeDefs'
import score from './scores/typeDefs'
import users from './users/typeDefs'

const typeDefs = [
    ...global,
    score,
    users,
]

export default typeDefs