const assert = require('assert')
const winston = require('winston')
const lodash = require('lodash')

let config = {
  env: process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development',
  port: process.env.PORT || 1337,
  db: {
    uri: 'mongodb://localhost',
    options: {
      useMongoClient: true
    }
  },
  logger: {
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        timestamp: true
      })
    ]
  }
}

let alreadyBeenSet = false

module.exports = function (value) {
  if (value === undefined) return config
  if (typeof value === 'string') return config[value]
  if (alreadyBeenSet) throw new Error('configuration can only be set once')

  assert(lodash.isPlainObject(value), 'config() expects an object to override the default configuration')

  config = lodash.merge(config, value)

  alreadyBeenSet = true
  this.updateLogger()
}
