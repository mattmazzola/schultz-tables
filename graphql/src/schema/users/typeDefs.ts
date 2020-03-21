import { gql } from 'apollo-server'

const typeDefs = gql`
    type User {
        id: String!
        email: String!
        name: String!
    }

    extend type Query {
        users(ignored: String): [User!]!
    }
`

export default typeDefs