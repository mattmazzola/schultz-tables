import global from './global/typeDefs'
import score from './scores/typeDefs'
import users from './users/typeDefs'
import tableTypes from './tableTypes/typeDefs'
import tableLayouts from './tableLayouts/typeDefs'

const typeDefs = [
    ...global,
    score,
    users,
    tableTypes,
    tableLayouts,
]

export default typeDefs