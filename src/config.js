'use strict'

const PORT = 6060
// const hostname = process.env.HOSTALIAS || os.hostname()

// export default {
module.exports = {
  // hostname,
  version: { // also exposed as API /version
    name: require('../package').name,
    app: require('../package').version,
    node: process.version
  },
  express: {
    port: PORT
  }
}

console.log('Config:', JSON.stringify(module.exports, null, 2))
