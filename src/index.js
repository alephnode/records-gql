const { ApolloServer, gql } = require('apollo-server-lambda')
const { importSchema } = require('graphql-import')
const { Prisma } = require('prisma-binding')
const path = require('path')

const typeDefs = importSchema(path.resolve('./schema.graphql'))

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
      typeDefs: path.resolve('../database/datamodel.prisma'),
      endpoint: process.env.PRISMA_ENDPOINT,
    }),
  }),
})

exports.handler = server.createHandler()
