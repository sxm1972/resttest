var express = require('express');
var bookRouter = express.Router();
var Book = require('./models/bookmodel');

bookRouter.use(function(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
bookRouter.get('/', function(req, res) {
    res.status(200).send('API Home page');
});
bookRouter.route('/Books')
    .get(function(req, res) {
        Book.find(function(err, books) {
                if (err) {
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.json(books);
                }
            })
            //res.status(404).send('GET Not implemented');
    })
    .post(function(req, res) {
        console.log(req.body);
        if (!req.body) {
            res.status(400).send('Bad Request');
        }
        else {

            if (req.body.title && req.body.author) {
                var bookjsonstr = "" ;
                console.log(bookjsonstr);
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
                        res.status(201).send(book);
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
    .put(function(req, res) {
        res.status(405).send('Method not allowed. Specify an id.');
    })
    .delete(function(req, res) {
        res.status(405).send('Method not allowed. Specify an id.');
    })
    .patch(function(req, res) {
        res.status(405).send(' Method not allowed. Specify an id.');
    });
bookRouter.route('/Books/:bookId')
    .get(function(req, res) {
        Book.findById(req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).send("Could not find book with Id: " + req.params.bookId);
            }
            else {
                if (book) {
                    res.json(book);
                }
                else {
                    res.status(200).send('No book found with id: ' + req.params.bookId);
                }
            }
        });
    })
    .post(function(req, res) {
        res.status(404).send('POST Not implemented for specific Id');
    })
    .put(function(req, res) {
        Book.findById(req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).send("Could not find book with Id: " + req.params.bookId);
            }
            else {
                if (typeof(req.body.title) != 'undefined' &&
                    typeof(req.body.author) != 'undefined' &&
                    typeof(req.body.genre) != 'undefined' &&
                    typeof(req.body.read) != 'undefined') {
                    book.title = req.body.title;
                    book.author = req.body.author;
                    book.genre = req.body.genre;
                    book.read = req.body.read;
                    console.log(book);
                    book.save();
                    res.json(book);
                }
                else {
                    res.status(400).send('Not all attributes sent');
                }
            }
        });
    })
    .delete(function(req, res) {
        Book.findById(req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).send("Could not delete book with Id: " + req.params.bookId);
            }
            else {
                if (book) {
                    book.remove(function(err) {
                        if (err) {
                            res.status(500).send('Could not remove book with Id:' + req.params.bookId);
                        }
                        else {
                            res.status(200).send('Removed book with Id: ' + req.params.bookId);
                        }
                    });
                }
                else {
                    res.status(500).send("Could not find book with Id: " + req.params.bookId);
                }

            }
        });
    })
    .patch(function(req, res) {
        Book.findById(req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).send("Could not find book with Id: " + req.params.bookId);
            }
            else {
                if (book._id)
                    delete book._id;

                for (var p in req.body) {
                    console.log('PATCH got: ' + p);
                    book[p] = req.body[p];

                }
                console.log(book);
                book.save(function(err) {
                    if (err) {
                        res.status(500).send('Could not remove book with Id:' + req.params.bookId);
                    }
                    else {
                        res.json(book);
                    }
                })
            }
        });
    });
    
    module.exports = bookRouter;