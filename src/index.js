const http = require('http')
const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')

const schema = require('./schema')
const config = require('./config')

const { port } = config.express

const app = express()
app.use('*', cors())
app.get('/', function (req, res) {
  res.json({ you: 'Home', status: 'OK', stamp: new Date().toISOString() })
})
app.get('/version', function (req, res) {
  res.json(config.version)
})
app.get('/health', function (req, res) {
  const stamp = new Date().toISOString()
  res.json({ status: 'OK', stamp })
})

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers

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
