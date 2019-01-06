const { ApolloServer, gql } = require('apollo-server-lambda')
const { importSchema } = require('graphql-import')
const { Prisma } = require('prisma-binding')
const { typeDefs: td } = require('../src/generated/prisma-schema')
const typeDefs = require('../src/schema')
const path = require('path')

const resolvers = {
  Query: {
    artists: (_, args, context, info) => {
      return context.prisma.query.artists({}, info)
    },
  },
}

const server = new ApolloServer({
  typeDefs: gql`
    ${typeDefs}
  `,
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
