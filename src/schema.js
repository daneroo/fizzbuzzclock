const { PubSub, gql } = require('apollo-server')
const { fizzbuzz } = require('./fizzbuzz')

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
    messages: [Message]
  }

  type Subscription {
    newMessage: Message
  }
`

const MESSAGE_ADDED = 'MESSAGE_ADDED'

const keepNMessages = 15
const recentMessages = []

const resolvers = {
  Query: {
    hello (root, { _noargs }, context) {
      return 'World'
    },
    messages (root, { _noargs }, context) {
      return recentMessages
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

const onceInAWhile = 100
const firstFew = 16
let count = 0
function publishToGQL (message) {
  if (count < firstFew || count % onceInAWhile === 0) {
    console.log('>>', JSON.stringify(message))
    if (count === firstFew - 1) {
      console.log(`.. I will be less chatty now (% ${onceInAWhile})`)
    }
  }
  count++

  pubsub.publish(MESSAGE_ADDED, message)

  recentMessages.push(message)
  while (recentMessages.length > keepNMessages) {
    recentMessages.shift()
  }
  // console.log(`keeping ${recentMessages.length} messages`)
}

const interval = 1000

setInterval(() => {
  const message = fizzbuzz()
  publishToGQL(message)
}, interval)

module.exports = { typeDefs, resolvers, publishToGQL }
