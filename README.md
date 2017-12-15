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

You can also override the default methods like so:

```js
const nongos = require('./index')
 
const {router, model} = nongos.resource(
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
  },
  {
    update: false,
    delete: false
  }
)

router.put('/:id', (req, res, next) => res.status(400).send({message: 'Nope!'}))
 
nongos.start()
```

After these changes you will get:

```js
GET http://localhost:1337/users // 200
GET http://localhost:1337/users/:id // 200
POST http://localhost:1337/users // 200
PUT http://localhost:1337/users/:id // 400 {"message": "Nope!"}
DELETE http://localhost:1337/users/:id // 404
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

### Overriding

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
