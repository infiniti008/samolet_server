var fs = require('fs');
var db_name = __dirname + "/temp.db";

//Создание базы данных

function create_db () {
    var exists = fs.existsSync(db_name);
    if (!exists) {
        console.log("Creating DB file: " + db_name);
        fs.openSync(db_name, "w");
    }
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(db_name);
    db.serialize(function () {
        db.run("CREATE TABLE if not exists samolet (dat TEXT, min TEXT, tem TEXT, day TEXT, tim TEXT)");
    });
    db.close();
}

//Добавление записи в базу

function add_temp (dates, minut, temp, day){
    console.log('Insert to base');
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    var time = ((minut - minut%60)/60) + ':' + minut%60;
    console.log(time);
    data_base.serialize(function() {
        var stmt = data_base.prepare("INSERT INTO samolet (dat, min, tem, day, tim) VALUES (?, ?, ?, ?, ?)");
        stmt.run(dates, minut, temp, day, time);
        stmt.finalize();
        //data_base.each("SELECT rowid AS id, headtitle, hour, minut, description FROM task", function(err, row) {
        //     console.log(row.id + ": " + row.headtitle + " - :" + row.hour + " - :" + row.minut + " - :" + row.description);
        //});
    });
    data_base.close();
    console.log('base closed');
}

//Извлечение данных из таблицы

function insert_from_base(){
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function () {

        data_base.each("SELECT rowid AS id, dat, min, tem, day, tim FROM samolet", function(err, row) {
            console.log(row.id + ": " + row.dat + " - " + row.min + " - " + row.tem + " - " + row.day+ " - " + row.tim);

            // console.log(row);
        });
    });
    data_base.close();
}


function select_last(cb){
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function () {

        data_base.each("SELECT rowid AS id, min, tim FROM samolet ORDER BY id DESC LIMIT 1", function(err, row) {
            // console.log(row.id + ": " + row.dat + " - " + row.min + " - " + row.tem + " - " + row.day+ " - " + row.tim);
            cb(row.min);
            console.log(row);
        });
    });
    data_base.close();
}


//Экспорт модулей

module.exports = {
    create_db : create_db,
    add_temp : add_temp,
    insert_from_base : insert_from_base,
    select_last : select_last
    //getAllFromBase : getAllFromBase
}