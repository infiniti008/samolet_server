var express = require('express');
var fs = require('fs');
var config = require('./config.json');

var app = express();
app.use(express.static(__dirname + '/public'));
// app.use('/source', express.static('/home/android/linux_list/so'));

app.listen(config.port, function () {
  console.log('Server run on port ' + config.port);
});

app.get('/',function (req, res) {
    
        res.end('klnjmkl');
});
    