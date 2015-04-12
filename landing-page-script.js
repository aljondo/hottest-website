function play() {
    var audio = document.getElementById('uploaded-song');
    var button = document.getElementById('play-pause-border');
    if (audio.paused) {
        audio.play();
        button.style.backgroundColor = '#efefef';
    }else{
        audio.pause();
        button.style.backgroundColor = '#34495e';
    }
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}