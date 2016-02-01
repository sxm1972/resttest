// Script to setup the Routes
var express = require('express');
var bookRouter = express.Router();
var Book = require('./models/bookmodel');

// Log the request method and UTC time for all requests that come in
bookRouter.use(function(req, res, next) {
    var date = new Date(Date.now());
    console.log(req.method + ' : Time: ', date.toISOString().replace(/T/, ' '));
    next();
});


//Handle the root route and redirect to the Books page
bookRouter.get('/', function(req, res) {
    res.redirect('api/Books');
});


var methodNotImplemented = function(req, res) {
        res.sendStatus(405);
    };
    
//Handle GET and POST requests on the base URL. These requests do not require
//a specific bookid to be provided
bookRouter.route('/Books')
    .get(function(req, res) {
        Book.find(function(err, books) {
            if (err) {
                res.status(500).send('Internal Server Error');
            }
            else {
                res.json(books);
            }
        });
    })
    .post(function(req, res) {
        console.log(req.body);
        if (!req.body) {
            res.status(400).send('Bad Request');
        }
        else {

            if (req.body.title && req.body.author) {
                //Check if a book with the same title and author is already in the DB
                var bookjson = JSON.parse('{"title" : "' + req.body.title + '", "author": "' + req.body.author + '"}');
                console.log(bookjson);
                Book.count(bookjson, function(err, bookcount) {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                    }
                    if (bookcount < 1) {
                        var book = new Book(req.body);
                        book.save();
                        console.log(book);
                        res.status(201).json(book);
                    }
                    else {
                        res.status(400).send('Book with same Title exists');
                    }
                });
            }
            else {
                res.status(400).send('Book should have Title and Author');
            }
        }
    })
    .put(methodNotImplemented)
    .patch(methodNotImplemented)
    .delete(methodNotImplemented)
    ;

//Intercept requests that provide a specific id on the base URL. Since all these requests
//need to find if the book exists in DB before they can be processed further, we do it
//at one place
bookRouter.use('/Books/:bookId', function(req, res, next) {
    Book.findById(req.params.bookId, function(err, book) {
        if (!err && book) {
            req.book = book;
            next();
        }
        else {
            res.status(404).send('No book found with id: ' + req.params.bookId);
        }
    });
});

//Intercept requests that provide a specific id on the base URL.
//POST method is not allowed here
bookRouter.route('/Books/:bookId')
    .get(function(req, res) {
        res.status(200).json(req.book);
    })
    .post(methodNotImplemented)
    .put(function(req, res) {
        if (typeof(req.body.title) != 'undefined' &&
            typeof(req.body.author) != 'undefined' &&
            typeof(req.body.genre) != 'undefined' &&
            typeof(req.body.read) != 'undefined') {
                req.book.title = req.body.title;
                req.book.author = req.body.author;
                req.book.genre = req.body.genre;
                req.book.read = req.body.read;
                console.log(req.book);
                req.book.save();
                res.json(req.book);
        }
        else {
            res.sendStatus(400);
        }
    })
    .delete(function(req, res) {
        if (req.book) {
            req.book.remove(function(err) {
                if (err) {
                    res.status(500).send('Could not remove book with Id:' + req.params.bookId);
                }
                else {
                    res.status(200).send('Removed book with Id: ' + req.params.bookId);
                }
            });
        }
    })
    .patch(function(req, res) {
        if (req.book._id)
            delete req.book._id;

        for (var p in req.body) {
            console.log('PATCH got: ' + p);
            req.book[p] = req.body[p];

        }
        console.log(req.book);
        req.book.save(function(err) {
            if (err) {
                res.status(500).send('Could not patch book with Id:' + req.params.bookId);
            }
            else {
                res.json(req.book);
            }
        })
    });

module.exports = bookRouter;