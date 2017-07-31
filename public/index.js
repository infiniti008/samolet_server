function onload(){
    
}

var id_timer;

function go_to_debug() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/go_to_debug', false);
    xhr.send();
    
    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        var time_load_debug = (xhr.responseText * 1) + 10;
        alert('Плата перейдет в режим отладки в - ' + ((time_load_debug - time_load_debug%60)/60) + ':' + time_load_debug%60); // responseText -- текст ответа.
    }
    
    var timer_inp = document.createElement('span');
    timer_inp.setAttribute('id', 'id_input');
    // timer_inp.innerHTML = 'dmlfkm';
    document.getElementById('menu').appendChild(timer_inp);
    var d = new Date();
    var tim_st = time_load_debug - ((d.getHours() * 60) + d.getMinutes());
    // var counter = time_load_debug - tim_st;
    var counter = 10;
    id_timer = setInterval(function(){
        document.getElementById('id_input').innerHTML = counter;
        if(counter == 0){
            clearInterval(id_timer);
            document.getElementById('menu').removeChild(document.getElementById('id_input'));
        }
        counter--;
        
    }, 1000);
    
}

function cancel_debug(){
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/cancel_debug', false);
    xhr.send();
    
    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        alert('Отмена перехода в режим отладки - ' + xhr.statusText); // responseText -- текст ответа.
    }
    clearInterval(id_timer);
    document.getElementById('menu').removeChild(document.getElementById('id_input'));
}


function start_put(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/put_temp?temp=21', false);
    xhr.send();
    
    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        alert( xhr.responseText ); // responseText -- текст ответа.
    }
}

