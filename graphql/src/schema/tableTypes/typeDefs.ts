import { gql } from 'apollo-server'

const typeDefs = gql`
    type TableType {
        id: String!
        width: Int!
        height: Int!
        properties: [KvPair!]!
    }

    extend type Query {
        tableTypes(ignored: String): [TableType!]!
    }
`

export default typeDefs