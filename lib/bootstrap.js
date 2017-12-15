const assert = require('assert')
const bodyParser = require('body-parser')
const compression = require('compression')
const expressLogger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const lodash = require('lodash')

module.exports = function (callback) {
  if (this.isBootstraped) return

  if (callback) {
    assert(lodash.isFunction(callback), '"callback" must be a function')
    this.isBootstraped = true
    return callback()
  }

  this.app.use(bodyParser.urlencoded({extended: true}))
  this.app.use(bodyParser.json())
  this.app.use(helmet())
  this.app.use(compression())
  this.app.use(cors())

  if (this.config('env') === 'development') {
    this.app.use(expressLogger(':date[iso] - Request: (:status) :method :url [:response-time ms]'))
  }

  this.isBootstraped = true
}
