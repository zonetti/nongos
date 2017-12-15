const assert = require('assert')
const async = require('async')
const lodash = require('lodash')
const mongoose = require('mongoose')
const router = require('express').Router()
const querymen = require('querymen')
const mongooseKeywords = require('mongoose-keywords')

module.exports = function (resource, schema = {}, options = {}) {
  assert(lodash.isString(resource), '"resource" must be a string')
  assert(lodash.isPlainObject(schema), '"schema" must be an object (Mongoose.Schema)')
  assert(lodash.isPlainObject(options), '"options" must be an object')

  const mongooseSchema = new mongoose.Schema(schema)

  if (options.keywords) {
    mongooseSchema.plugin(mongooseKeywords, options.keywords)
  }

  const mongooseModel = mongoose.model(resource, mongooseSchema)

  router.param('id', (req, res, next, id) => {
    mongooseModel.findById(id, (err, obj) => {
      if (err) return next(err)
      if (!obj) {
        const error = new Error('Resource not found')
        error.statusCode = 404
        error.expected = true
        return next(err)
      }
      req[resource] = obj
      next()
    })
  })

  if (options.list !== false) {
    router.get('/', querymen.middleware(), (req, res, next) => {
      const query = req.querymen
      mongooseModel.find(query.query, query.select, query.cursor, (err, result) => {
        if (err) return next(err)
        res.send(result)
      })
    })
  }

  if (options.read !== false) {
    router.get('/:id', (req, res, next) => {
      res.send(req[resource])
    })
  }

  if (options.create !== false) {
    router.post('/', (req, res, next) => {
      mongooseModel.create(req.body, (err, result) => {
        if (err) return next(err)
        res.send(result)
      })
    })
  }

  if (options.update !== false) {
    router.put('/:id', (req, res, next) => {
      const newData = lodash.merge(req[resource], req.body)
      async.waterfall([
        (done) => mongooseModel.update({_id: req[resource]._id}, newData, done),
        (result, done) => mongooseModel.findById(req.params.id, done)
      ], (err, result) => {
        if (err) return next(err)
        res.send(result)
      })
    })
  }

  if (options.delete !== false) {
    router.delete('/:id', (req, res, next) => {
      mongooseModel.remove({_id: req[resource]._id}, (err) => {
        if (err) return next(err)
        res.send({})
      })
    })
  }

  const newResource = {
    name: resource,
    model: mongooseModel,
    router
  }

  this.resources.push(newResource)

  return newResource
}
