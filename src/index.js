const http = require('http')
const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')

const schema = require('./schema')
const config = require('./config')
const { fizzbuzz } = require('./fizzbuzz')

const { port } = config.express

let connectionCount = 0 // number of active graphql subscriptions
const app = express()
app.use('*', cors())
app.get('/', function (req, res) {
  const message = fizzbuzz() // {id, stamp,text}
  res.json(message)
})
app.get('/version', function (req, res) {
  res.json(config.version)
})

const serverStartTime = new Date()
app.get('/health', function (req, res) {
  const stamp = new Date().toISOString()
  const uptime = (+new Date() - serverStartTime) / 1000
  res.json({ status: 'OK', stamp, connectionCount, uptime })
})

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log({ connections: ++connectionCount })
    },
    onDisconnect: (webSocket, context) => {
      console.log({ connections: --connectionCount })
    }
  }

})

server.applyMiddleware({ app }) // app is from an existing express app

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

console.log(`FizzBuzzClock Start config: ${JSON.stringify(config)}`)
console.log(`FizzBuzzClock versions: ${JSON.stringify(require('process').versions)}`)
httpServer.listen({ port }, () => {
  console.log(`FizzBuzzClock Graphql Server ready at http://0.0.0.0:${port}${server.graphqlPath}`)
  console.log(`FizzBuzzClock Subscriptions  ready at ws://:${port}${server.subscriptionsPath}`)
})
