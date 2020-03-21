import { gql } from 'apollo-server'

const typeDefs = gql`
    type Start {
        value: String!
    }

    # ScoreInput
    input ScoreInput {
        signedStartTime: String!
        userId: String!
        startTime: Float!
        endTime: Float!
        userSequence: [AnswerInput!]!
        expectedSequence: [String!]!
        randomizedSequence: [String!]!
        tableWidth: Int!
        tableHeight: Int!
        tableProperties: [KvPairInput!]!
    }

    input AnswerInput {
        time: Float!
        cell: CellInput!
        correct: Boolean!
    }

    input CellInput {
        classes: [String!]!
        text: String!
        x: Int!
        y: Int!
    }

    input KvPairInput {
        key: String!
        value: String!
    }
    
    # Sore
    type Score {
        id: String!
        userId: String!
        startTime: Float!
        endTime: Float!
        duration: Int!
        durationMilliseconds: Int!
        sequence: [Answer]!
        tableLayoutId: String!
        tableTypeId: String!
    }

    type Answer {
        time: Float!
        cell: Cell!
        correct: Boolean!
    }

    type Cell {
        classes: [String!]!
        text: String!
        x: Int!
        y: Int!
    }

    type KvPair {
        key: String!
        value: String!
    }

    type ScoreDetails {
        id: String!
        userId: String!
        startTime: Float!
        endTime: Float!
        duration: Int!
        durationMilliseconds: Int!
        sequence: [Answer]!
        tableLayout: TableLayout!
        tableType: TableType!
    }

    type ScoresResponse {
        scores: [Score!]!
        users: [User!]!
    }

    extend type Query {
        scores(tableTypeId: String!, page: Int): ScoresResponse!
        score(id: String!): ScoreDetails!
        userScores(userId: String!): [Score!]!
    }

    extend type Mutation {
        start(ignored: String): Start!
        addScore(scoreInput: ScoreInput): Score!
    }
`
export default typeDefs