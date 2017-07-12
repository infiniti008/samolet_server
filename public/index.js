function onload(){
    var mod = document.getElementById('cur_mode').innerHTML;
    if (mod == 1) {
        document.getElementById('input_mode_1').checked = true;
    } 
    else if(mod == 2) {
        document.getElementById('input_mode_2').checked = true;
    }
     else if(mod == 3) {
        document.getElementById('input_mode_3').checked = true;
    }
}