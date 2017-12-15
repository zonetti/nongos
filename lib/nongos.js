function Nongos () {
  this.resources = []
  this.updateLogger()
}

Nongos.prototype.config = require('./config')
Nongos.prototype.bootstrap = require('./bootstrap')
Nongos.prototype.resource = require('./resource')
Nongos.prototype.updateLogger = require('./logger')
Nongos.prototype.start = require('./start')

module.exports = new Nongos()
module.exports.Nongos = Nongos
