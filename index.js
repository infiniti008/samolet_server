var express = require('express');
var fs = require('fs');
var config = require('./config.json');
var cur_mode = '1';

var pogoda_data = {
    uri : 'http://rp5.by/%D0%9F%D0%BE%D0%B3%D0%BE%D0%B4%D0%B0_%D0%B2_%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%D0%B5,_%D0%91%D0%B5%D0%BB%D0%B0%D1%80%D1%83%D1%81%D1%8C',
    sun_up : '#forecastTable > tbody > tr:nth-child(12) > td:nth-child(4).grey',
    sun_down : '#forecastTable > tbody > tr:nth-child(12) > td:nth-child(5).litegrey'
};

var request = require('request'), cheerio = require('cheerio');

//Загружаем страницу
request({uri:pogoda_data.uri, method:'GET', encoding:'binary'},
    function (err, res, page) {
        //Передаём страницу в cheerio
        var $=cheerio.load(page);
        //Идём по DOM-дереву обычными CSS-селекторами
        var img_src=$(pogoda_data.sun_down).text();
        console.log(img_src);
    });
    
var app = express();
app.use(express.static(__dirname + '/public'));
// app.use('/source', express.static('/home/android/linux_list/so'));

app.listen(config.port, function () {
  console.log('Server run on port ' + config.port);
});

//Get data from ESP
app.get('/put_temp',function (req, res) {
    console.log(req.query);
    var new_date = new Date();
    var hour
    res.end(cur_mode);
});
    