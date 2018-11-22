const { PubSub, gql } = require('apollo-server')
const { ulid } = require('ulid')

const pubsub = new PubSub()

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Message {
    id: ID!
    stamp: String!
    text: String!
  }

  type Query {
    hello: String!
  }

  type Subscription {
    newMessage: Message
  }
`

const MESSAGE_ADDED = 'MESSAGE_ADDED'

const resolvers = {
  Query: {
    hello (root, { _noargs }, context) {
      return 'World'
    }
  },

  Subscription: {
    newMessage: {
      resolve: (payload, args, context, _info) => {
        // console.log({payload, args, context})
        return payload
      },
      subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED])
    }
  }
}

function publishToGQL (message) {
  console.log('>>', message)
  pubsub.publish(MESSAGE_ADDED, message)
}

const interval = 3000

setInterval(() => {
  const message = {
    id: ulid(),
    stamp: new Date().toISOString(),
    text: '---'
  }
  publishToGQL(message)
}, interval)

module.exports = { typeDefs, resolvers, publishToGQL }
