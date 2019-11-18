
const { ulid } = require('ulid')

function fizzbuzz (d = new Date()) {
  const id = ulid()
  const stamp = d.toISOString()
  const s = d.getSeconds()

  const text = (s % 3 ? '' : 'fizz') + (s % 5 ? '' : 'buzz') || '---'

  const message = { id, stamp, text }
  return message
}

module.exports = { fizzbuzz }
