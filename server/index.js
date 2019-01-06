const { ApolloServer, gql } = require('apollo-server-lambda')
const { importSchema } = require('graphql-import')
const { Prisma } = require('prisma-binding')
const { typeDefs: td } = require('../src/generated/prisma-schema')
const path = require('path')

const typeDefs = gql`
  type Query {
    info: String!
    records: [Record!]!
    artists: [Artist!]!
    artist(name: String): [Artist!]!
    tracks: [Track!]!
    categories: [Category]
  }

  type Artist {
    id: ID!
    name: String!
    records: [Record]
  }

  type Record {
    id: ID!
    name: String!
    tracks: [Track]
  }

  type Track {
    id: ID!
    name: String!
    track_no: Int
    artists: [Artist]
  }

  type Category {
    id: ID!
    name: String!
    description: String
  }
`

const resolvers = {
  Query: {
    artists: (_, args, context, info) => {
      return context.prisma.query.artists({}, info)
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: td,
      endpoint: process.env.PRISMA_ENDPOINT,
    }),
  }),
})

exports.handler = server.createHandler()
