require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')

// TODO attach to data source
const artists = [
  {
    name: 'Georgia Anne Muldrow',
    records: [
      {
        name: 'Overload',
        tracks: [
          {
            name: 'Play It Up',
          },
        ],
      },
    ],
  },
]

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
    artists: () => artists,
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`✨  Server listening at ${url}`)
})
