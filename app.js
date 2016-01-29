var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');


var db = mongoose.connect('mongodb://localhost/bookAPI');
var Book = require('./models/bookmodel');

var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req,res){
    res.send('Welcome to resttest API!');
});

var bookRouter = express.Router();
bookRouter.route('/Books')
    .get(function(req,res){
        res.status(404).send('GET Not implemented');
    })
    .post(function(req,res){
        var book = new Book(req.body);
        book.save();
        res.status(201).send(book);
    })
    .put(function(req,res){
        res.status(404).send('PUT Not implemented');
    })
    .delete(function(req,res){
        res.status(404).send('DELETE Not implemented');
    })
    .patch(function(req,res){
        res.status(404).send(' PATCH Not implemented');
    });
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json);
app.use('/api',bookRouter);

app.listen(port,process.env.IP,1,function() {
    console.log('Listening on ' + process.env.IP +':' + port);
});

