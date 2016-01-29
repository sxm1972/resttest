var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req,res){
    res.send('Welcome to my API!');
});

app.listen(port,process.env.IP,1,function() {
    console.log('Listening on ' + process.env.IP +':' + port);
});

