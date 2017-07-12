var express = require('express');
var fs = require('fs');
var config = require('./config.json');
var request = require('request'), cheerio = require('cheerio');
var cur_mode = '1';
var time_after_zakat = 20;

var pogoda_data = require('./pogoda_data.json');
var sun = {};


function get_pogoda(cb){
    //Загружаем страницу
    request({uri:pogoda_data.today.uri, method:'GET', encoding:'binary'},
        function (err, res, page) {
            //Передаём страницу в cheerio
            var $=cheerio.load(page);
            //Идём по DOM-дереву обычными CSS-селекторами
            sun.up = $(pogoda_data.today.sun_up).text();
            
            var t = sun.up.split(':');
            sun.up_min = (+t[0]) * 60 + (+t[1]) * 1;
            sun.down = $(pogoda_data.today.sun_down).text();
            var p = sun.down.split(':');
            sun.down_min = (+p[0]) * 60 + (+p[1]) * 1;
            console.log(sun);
            cb();
        }
    );
}    
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
    var hour = new_date.getHours();
    var minute = new_date.getMinutes();
    var cur_time = (hour * 60) + (minute * 1);
    console.log(cur_time);
    get_pogoda(function () {
        if (cur_time + 400> sun.down_min + time_after_zakat) {
            cur_mode = '2';
        }
        console.log(cur_mode);
        // res.end(cur_mode);
        
        var file = fs.readFileSync(__dirname + '/index.html', 'utf8').toString();
        file = file.replace(/{{cur_mode}}/ig, cur_mode);
        res.end(file);
    });
    
});

app.get('/',function (req, res) {
    var file = fs.readFileSync(__dirname + '/index.html', 'utf8').toString();
        file = file.replace(/{{cur_mode}}/ig, cur_mode);
        res.end(file);
});

var n_res;

app.get('/change_mode',function (req, res) {
    var new_mode = req.query;
    console.log(new_mode);
    n_res = res;
    res.send('<a href="/send_res">dflkjdflgkdflgk</a>');
});

app.get('/send_res',function (req, res) {
    n_res.end('1221323423434554');
});