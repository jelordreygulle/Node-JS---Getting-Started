const express = require('express')
const app = express()
const port = 3000
const birds = require('./birds')
const path = require('path')
const debug = require('debug')

app.use(express.static('public'));
app.use('/birds', birds)

app.use('/static', express.static('public'))

// route paths based on strings.
app.get('/', function (req, res) {
    res.send('root')
})
app.get('/about', function (req, res) {
    res.send('about')
})

app.get('/random.text', function (req, res) {
    res.send('random.text')
})

app.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

// route paths based on string patterns.
app.get('/ab?cd', function (req, res) {
    console.log("hello")
    debug(req.method + ' ' + req.url);
    res.send('ab?cd')
})

app.get('/ab+cd', function (req, res) {
    console.log(req.method)
    res.send('ab+cd')
})

app.get('/ab*cd', function (req, res) {
    res.send('ab*cd')
})

app.get('/ab(cd)?e', function (req, res) {
    res.send('ab(cd)?e')
})

//route paths based on regular expressions:
// app.get(/a/, function (req, res) {
//     res.send('/a/')
// })

app.get(/.*fly$/, function (req, res) {
    res.send('/.*fly$/')
})

//route parameters , hyphen (-) and the dot (.)
app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
})

app.get('/flights/:from-:to', function (req, res) {
    res.send(req.params)
})

app.get('/plantae/:genus.:species', function (req, res) {
    res.send(req.params)
})

//regular expression in parentheses (()):
app.get('/user/:userId(\d+)', function (req, res) {
    res.send(req.params)
})

app.all('/secret', function (req, res, next) {
    res.send('Accessing the secret section ...')
    next() // pass control to the next handler
})

//route handlers , multiple callback functions
app.get('/example/b', function (req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()
}, function (req, res) {
    res.send('Hello from B!')
})

//array of callback functions
var cb0 = function (req, res, next) {
    console.log('CB0')
    next()
}

var cb1 = function (req, res, next) {
    console.log('CB1')
    next()
}

var cb2 = function (req, res) {
    res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

//handling a route using independent function and arrays of functions
var cb0 = function (req, res, next) {
    console.log('CB0')
    next()
}

var cb1 = function (req, res, next) {
    console.log('CB1')
    next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()
}, function (req, res) {
    res.send('Hello from D!')
})

//chained route handlers defined using app.route()

app.route('/book')
    .get(function (req, res) {
        res.send('Get a random book')
    })
    .post(function (req, res) {
        res.send('Add a book')
    })
    .put(function (req, res) {
        res.send('Update the book')
    })

//error handling
app.get('/', function (req, res, next) {
    fs.readFile('/file-does-not-exist', function (err, data) {
        if (err) {
            next(err) // Pass errors to Express.
        } else {
            res.send(data)
        }
    })
})



app.listen(port, () => console.log(`"Example app listening on port ${port}!"`))