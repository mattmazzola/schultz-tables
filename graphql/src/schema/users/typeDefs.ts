import { gql } from 'apollo-server'

const typeDefs = gql`
    type User {
        id: String!
        email: String!
        emailVerified: Boolean!
        name: String!
        nickname: String!
        picture: String!
    }

    extend type Query {
        users(ignored: String): [User!]!
    }
`

export default typeDefs