function onload(){
    qw();
}

function go_to_debug() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/go_to_debug', false);
    xhr.send();
    
    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        alert( xhr.responseText ); // responseText -- текст ответа.
    }
}

function reload_page(){
    window.location.reload(true);
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
function qw() {
    var t = 'w';
    var [t] = 100;
    alert([t]);
}