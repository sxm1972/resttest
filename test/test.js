// Tests for resttest API
var should = require('should');
var assert = require('assert');
var request = require('supertest');



describe('Book API tests', function() {
    var url = 'https://resttest-sxm1972.c9users.io';
    var bookid = '';
    before(function(done) {
        done(); // nothing for now
    })

    describe('Initial books listing', function() {
        it('should return empty list', function(done) {
            request(url)
                .get('/api/Books')
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    //console.log(res.body);
                    var bodyjsonlength = res.body.length;
                    assert.equal(bodyjsonlength, 0, 'Initial books listing should be empty');
                    done();
                });
        });
    });
    describe('Adding a book', function() {
        it('should return the details of the book added', function(done) {
            var bodyjson = {
                title: 'Moby Dick',
                author: 'Herman Melville',
                genre: 'Literature',
                read: false
            };

            request(url)
                .post('/api/Books')
                .send(bodyjson)
                .expect("Content-type", /json/)
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(201);
                    //console.log(res.body);
                    res.body.should.have.property('_id');
                    res.body.title.should.equal('Moby Dick');
                    res.body.author.should.equal('Herman Melville');
                    bookid = res.body._id;
                    done();
                });
        });
        it('should return error on adding a duplicate title', function(done) {
            var bodyjson = {
                title: 'Moby Dick',
                author: 'Herman Melville',
                genre: 'Literature',
                read: false
            };

            request(url)
                .post('/api/Books')
                .send(bodyjson)
                .expect("Content-type", /text/)
                .expect(400)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(400);
                    //console.log(res);
                    assert.equal(res.text, 'Book with same Title exists', 'Error returned is not correct');
                    done();
                });
        });
        it('should return error if title is not provided', function(done) {
            var bodyjson = {
                author: 'Herman Melville',
                genre: 'Literature',
                read: false
            };

            request(url)
                .post('/api/Books')
                .send(bodyjson)
                .expect(400)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(400);
                    ////console.log(res.body.toString());
                    assert.equal(res.text, 'Book should have Title and Author', 'Error returned is not correct');
                    done();
                });
        });
        it('should return error if author is not provided', function(done) {
            var bodyjson = {
                title: 'Moby Dick',
                genre: 'Literature',
                read: false
            };

            request(url)
                .post('/api/Books')
                .send(bodyjson)
                .expect(400)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(400);
                    ////console.log(res.body.toString());
                    assert.equal(res.text, 'Book should have Title and Author', 'Error returned is not correct');
                    done();
                });
        });        
        it('should return error if specific id is provided', function(done) {
            var poststring = '/api/Books/' + bookid;
            //console.log(poststring);
            request(url)
                .post(poststring)
                .expect(405)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(405);
                    done();
                });
        });
    });
    describe('After adding books listing', function() {
        it('should return all books', function(done) {
            request(url)
                .get('/api/Books')
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    //console.log(res.body);
                    var bodyjsonlength = res.body.length;
                    assert.equal(bodyjsonlength, 1, 'One book should be added');
                    done();
                });
        });
        it('should return specific book with id', function(done) {
            var getstring = '/api/Books/' + bookid;
            request(url)
                .get(getstring)
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    //console.log(res.body);
                    res.body.should.have.property('_id');
                    res.body._id.should.equal(bookid);
                    res.body.title.should.equal('Moby Dick');
                    res.body.author.should.equal('Herman Melville');
                    done();
                });
        });        
    });    
    describe('Updating a book', function() {
        it('should return the details of the book added', function(done) {
            var bodyjson = {
                title: 'Moby Dick',
                author: 'Herman Melville',
                genre: 'Fiction',
                read: false
            };

            var poststring = '/api/Books/' + bookid;
            //console.log(poststring);
            request(url)
                .put(poststring)
                .send(bodyjson)
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    //console.log(res.body);
                    var bodyjsonlength = res.body.length;
                    res.body.should.have.property('_id');
                    res.body._id.should.equal(bookid);
                    res.body.genre.should.equal('Fiction'); // this is what we changed using the PUT request
                    done();
                });
        });
        it('should return error if not all properties are provided for PUT', function(done) {
            var bodyjson = {
                title: 'Moby Dick',
                author: 'Herman Melville',
                genre: 'Fiction'
            };

            var poststring = '/api/Books/' + bookid;
            //console.log(poststring);
            request(url)
                .put(poststring)
                .send(bodyjson)
                .expect(400)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(400);
                    done();
                });
        });
        it('should return success when any property is updated using PATCH ', function(done) {
            var bodyjson = {
                genre: 'Literature',
                read: true
            };

            var poststring = '/api/Books/' + bookid;
            //console.log(poststring);
            request(url)
                .patch(poststring)
                .send(bodyjson)
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body._id.should.equal(bookid);
                    res.body.genre.should.equal('Literature'); // this is what we changed using the PATCH request
                    done();
                });
        });    
        
    });
    
    describe('Deleting a book', function() {

        it('should return success', function(done) {
            var poststring = '/api/Books/' + bookid;
            //console.log(poststring);
            request(url)
                .delete(poststring)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.equal(200);
                    res.text.should.equal('Removed book with Id: ' + bookid);
                    bookid = '';
                    done();
                });
        });
    });

    describe('Populate', function() {
        it.only('should add the books from a file', function(done) {
            var books = require('./books.json');
            if (!books.length)
                throw "Could not load books";
            console.log (books)    ;
            books.forEach(function(book) {
                console.log(book);
                request(url)
                    .post('/api/Books')
                    .send(book)
                    .expect("Content-type", /json/)
                    .expect(201)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.status.should.equal(201);
                        //console.log(res.body);
                        res.body.should.have.property('_id');
                        res.body.title.should.equal(book.title);
                        res.body.author.should.equal(book.author);
                        bookid = res.body._id;
                        done();
                    });
            });
        });
    });
});
