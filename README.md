# nongos

[![JS Standard Style][standard-image]][standard-url]
[![NPM version][npm-image]][npm-url]

**Project still under development!**

An opinionated framework for fast prototyping RESTful APIs with Node.js based on the MEAN stack!

## Install

```sh
npm i nongos -S
```

## Basic usage

```js
const nongos = require('nongos')

nongos.resource(
  'users',
  {
    name: {
      type: String,
      required: [true, 'required']
    },
    age: {
      type: Number,
      required: [true, 'required'],
      min: [10, 'at least 10']
    }
  }
)

nongos.start()
```

Done! Now you have a fully RESTful resource out of the box (CRUD). Give it a try:

```js
GET http://localhost:1337/users
GET http://localhost:1337/users/:id
POST http://localhost:1337/users
PUT http://localhost:1337/users/:id
DELETE http://localhost:1337/users/:id
```

## Configuration

### Default configuration

```js
{
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
```

For more information on how to configure the path `db.options`, check the [mongoose documentation](http://mongoosejs.com/docs/connections.html#options).

For more information on how to configure the path `logger`, check the [winston repository](https://github.com/winstonjs/winston).

### Changing the configuration

```js
const nongos = require('nongos')

nongos.config({
  port: process.env.PORT || 3000,
  db: {
    uri: 'mongodb://myuser:mypass@myserver.com:59767/temp'
  }
})

// ...
```

## Bootstrapping

If you want to override the default [bootstrap](https://github.com/zonetti/nongos/blob/master/lib/bootstrap.js#L18-L26) you can use `nongos.bootstrap()`, just **be aware** that by doing so, the default bootstrap will no longer execute.

```js
const nongos = require('nongos')

nongos.resource(
  'users',
  {
    name: String,
    age: Number
  }
)

nongos.bootstrap(() => {
  nongos.app.use(require('./my-middleware'))
})

nongos.start()
```

## Resources

### Validation

Because `nongos` uses `mongoose` you are able to validate your schema using the `mongoose` built-in rules or you can also create your own.

Check the full documentation at the [mongoose website](http://mongoosejs.com/docs/validation.html).

### Methods

You can override or disable the default resource methods and also create new methods:

```js
const nongos = require('nongos')
 
const {router, model} = nongos.resource(
  'users',
  {
    name: String,
    age: Number
  },
  {
    update: false,
    delete: false
  }
)

router.put('/:id', (req, res) => res.status(400).send({message: 'Nope!'}))

router.get('/foo', (req, res) => res.send('bar'))

router.post('/john-doe', (req, res, next) => {
  model.create({name: 'John Doe', age: 50}, (err, result) => {
    if (err) return next(err)
    res.send(result)
  })
})
 
nongos.start()
```

After these changes you will get:

```js
GET http://localhost:1337/users // 200
GET http://localhost:1337/users/foo // 200 "bar"
GET http://localhost:1337/users/:id // 200
POST http://localhost:1337/users // 200
POST http://localhost:1337/users/john-doe // 200 {"__v": 0, "name": "John Doe", "age": 50, "_id": "5a3320b4e99a953ff07729a3"}
PUT http://localhost:1337/users/:id // 400 {"message": "Nope!"}
DELETE http://localhost:1337/users/:id // 404
```

### Querying

You can use some advanced querying thanks to `querymen`.

For more information check its [documentation](https://github.com/diegohaz/querymen).

```js
GET http://localhost:1337/posts?page=2&limit=30
GET http://localhost:1337/posts?user=foobar&fields=title,content
GET http://localhost:1337/posts?limit=10&sort=-createdAt
```

### Additional options

As seen above in the [validation](#validation) block, you can use the optional third parameter of `nongos.resource()` to override the default CRUD behavior.

In addition to that you can also configure the `keywords` feature powered by `mongoose-keywords`. Check its [documentation](https://github.com/diegohaz/mongoose-keywords) for more information on how to do so.

```js
const nongos = require('nongos')
 
const {router, model} = nongos.resource(
  'users',
  {
    name: String,
    age: Number
  },
  {
    list: true,
    create: true,
    read: true,
    update: false,
    delete: false,
    keywords: {
      path: ['name']
    }
  }
)

nongos.start()
```

## Stack explained

* **[mongoose](https://github.com/Automattic/mongoose):** MongoDB object modeling tool
* **[winston](https://github.com/winstonjs/winston):** logger
* **[express](https://github.com/expressjs/express):** web framework / routing
* **[body-parser](https://github.com/expressjs/body-parser):** body parsing middleware
* **[morgan](https://github.com/expressjs/morgan):** HTTP request logger middleware
* **[compression](https://github.com/expressjs/compression):** compression middleware
* **[cors](https://github.com/expressjs/cors):** CORS middleware
* **[helmet](https://github.com/helmetjs/helmet):** security good practices for `express`
* **[querymen](https://github.com/diegohaz/querymen):** querystring parser middleware for MongoDB
* **[mongoose-keywords](https://github.com/diegohaz/mongoose-keywords):** `mongoose` plugin for searching

## License

MIT

[standard-url]: http://standardjs.com
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[npm-url]: https://npmjs.org/package/nongos
[npm-image]: https://img.shields.io/npm/v/nongos.svg?style=flat-square
