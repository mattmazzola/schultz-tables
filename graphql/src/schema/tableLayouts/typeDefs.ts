import { gql } from 'apollo-server'

const typeDefs = gql`
    type TableLayout {
        id: String!
        width: Int!
        height: Int!
        expectedSequence: [String!]!
        randomizedSequence: [String!]!
    }

    extend type Query {
        tableLayouts(ignored: String): [TableLayout!]!
    }
`

export default typeDefs