const winston = require('winston')

module.exports = function () {
  this.log = new (winston.Logger)(this.config('logger'))
}
