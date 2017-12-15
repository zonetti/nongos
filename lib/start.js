const assert = require('assert')
const async = require('async')
const express = require('express')
const mongoose = require('mongoose')
const lodash = require('lodash')

module.exports = function (callback) {
  if (!callback) {
    callback = (err) => {
      if (err) throw err
      this.log.info('Nongos started!', {
        env: this.config('env'),
        port: this.config('port')
      })
    }
  }

  assert(lodash.isFunction(callback), '"callback" must be a function')

  this.app = express()

  this.bootstrap()

  this.resources.forEach(resource => {
    this.log.info('Resource added', {resource: resource.name})
    this.app.use(`/${resource.name}`, resource.router)
  })

  this.app.all('*', (req, res) => res.status(404).send({message: 'Not found'}))

  this.app.use((err, req, res, next) => {
    if (err.errors && lodash.isPlainObject(err.errors)) {
      err.statusCode = 400
      err.expected = true
      const mongoErrors = Object.keys(err.errors)
      err.errors = mongoErrors.map(key => {
        return {
          field: key,
          message: err.errors[key].message
        }
      })
    }

    if (err.stack && !err.expected) {
      this.log.error(err.stack)
    }

    const statusCode = err.statusCode || 500

    const responseObj = {
      message: statusCode.toString()[0] === '4' ? 'Bad request' : 'Internal server error. Try again later.'
    }

    if (err.errors) {
      responseObj.errors = err.errors
    }

    if (!responseObj.errors) {
      responseObj.errors = [{message: err.message}]
    }

    res.status(err.statusCode || 500).send(responseObj)
  })

  async.parallel([
    (done) => mongoose.connect(this.config('db').uri, this.config('db').options, done),
    (done) => this.app.listen(this.config('port'), done)
  ], callback)
}
