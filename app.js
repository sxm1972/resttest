var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');


var db = mongoose.connect('mongodb://localhost/bookAPI');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


var urlencodedparser = bodyparser.urlencoded({
    extended: true
});

app.use(urlencodedparser);
app.use(express.static(__dirname + '/public'));

// Log the request method and UTC time for all requests that come in
app.use(function(req, res, next) {
    var date = new Date(Date.now());
    console.log(req.method + ' : Time: ', date.toISOString().replace(/T/, ' '));
    next();
});
var jsonparser = bodyparser.json();
if (!jsonparser) {
    console.log('could not create json parser');
}
else {
    app.use(jsonparser);
}

var bookRouter = require('./bookrouter');
    
app.use('/api', bookRouter);

app.listen(port, process.env.IP, 1, function() {
    console.log('Listening on ' + process.env.IP + ':' + port);
});
