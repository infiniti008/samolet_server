var express = require('express');
var fs = require('fs');
var db = require(__dirname + '/db/db.js');

var config = require(__dirname + '/config.json');
var request = require('request'), cheerio = require('cheerio');
var pogoda_data = require(__dirname +'/pogoda_data.json');

var cur_mode = '3';
var go_to_debug = false; //variable to go to debug mode
var go_to_newDay = false; //variable to reload info about new day



var app = express();
db.create_db();
app.use(express.static(__dirname + '/public'));
// app.use('/source', express.static('/home/android/linux_list/so'));

app.listen(config.port, function () {
  console.log('Server run on port ' + config.port);
});

//constructor new day
function Day(){
    this.set_time();
    this.set_cur_data();
    this.reload_current_time();
    console.log(this);
}
//method to set time start and end mode3
Day.prototype.set_time = function (){
    get_time_to_mode3().then(
        result => {
            // console.log(result)
            this.start = result.start;
            this.end = result.end;
            this.reload_mode();
            console.log('Add to current day time start and end mode 3');
            console.log(this);
        }
    );
};
//method to reload current time
Day.prototype.reload_current_time = function() {
    this.curent_time = get_current_time();
    var t_d = new Date();
    if(this.date != t_d.getDate()){
        //get new day
        console.log('Go to change day');
        this.set_cur_data();
        go_to_newDay = true;
    }
};
//method to reload current mode
Day.prototype.reload_mode = function() {
    this.reload_current_time();
    if(go_to_debug == true){
        //debug mode
        this.mode = '2';
        go_to_debug = false;
    }
    else if(this.curent_time > this.start && this.curent_time < this.end){
        //night mode
        this.mode = '3';
    }
    else{
        //day mode
        this.mode = '1';
    }
};
//method to set current data
Day.prototype.set_cur_data = function () {
    var dat = new Date();
    this.date = dat.getDate();
    this.month = dat.getMonth() * 1 + 1;
    this.years = dat.getFullYear();
    this.day = add_null(this.date) + '/' + add_null(this.month) + '/' + this.years;
    console.log(this.day);
};

var day = new Day();
// first_run();

function first_run() {
    
}

// function work() {
//     setInterval(get_time_mode3, 1000 * 60 * 60 * 24);
// }

//function return time for start and end mode 3
function get_time_to_mode3() {
    return new Promise(function(resolve, reject)
	{
		//псевдо асинхронный код
		var time_to_mode3 = {};
        request({uri:pogoda_data.today.uri, method:'GET', encoding:'binary'},
        function (err, res, page) {
            if(err){
                return reject(err);
            }
            else if(!err){
                //Передаём страницу в cheerio
                var $=cheerio.load(page);
                //Идём по DOM-дереву обычными CSS-селекторами
                var sun_down = $(pogoda_data.today.sun_down).text();
                var p = sun_down.split(':');
                var down = (+p[0]) * 60 + (+p[1]) * 1;
                time_to_mode3.start = down + config.time_after_zakat * 1;
                time_to_mode3.end = time_to_mode3.start + config.time_long_mode3 * 1;
                // console.log(time_to_mode3);
                return resolve(time_to_mode3);
            }
        });
	});
}
//return current time in minute
function get_current_time() {
    var new_date = new Date();
    var hour = new_date.getHours();
    var minute = new_date.getMinutes();
    var cur_time = (hour * 60) + (minute * 1);
    return(cur_time);
}
//add 0 to date or month
function add_null(x){
    if((x * 1) < 10){
        return('0' + x);
    }
    else{
        return(x);
    }
}

//Get data from ESP
app.get('/put_temp',function (req, res) {
    day.reload_mode();
    console.log(req.query);
    res.end(day.mode);
    console.log('Send to esp mode = ' + day.mode);
    console.log(day.curent_time);
    //If exist label to change day
    if(go_to_newDay == true){
        go_to_newDay = false;
        day.set_time();
        day.set_cur_data();
        day.reload_current_time();
    }
    db.add_temp(day.date, day.curent_time, req.query.temp, day.day);
});

app.get('/',function (req, res) {
    var file = fs.readFileSync(__dirname + '/index.html', 'utf8').toString();
        file = file.replace(/{{cur_mode}}/ig, cur_mode);
        res.end(file);
});


app.get('/go_to_debug',function (req, res) {
    go_to_debug = true;
    db.select_last(function (tim) {
        console.log("Send to server last time of put_temp");
        res.send(tim);
    });
    console.log("Change GO_TO_DEBUG to true");
});

app.get('/cancel_debug',function (req, res) {
    go_to_debug = false;
        res.send('ok');
    console.log("Change GO_TO_DEBUG to false");
});

