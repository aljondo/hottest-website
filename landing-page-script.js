/*
    constructs and global variables af
*/
//simple constructor for a light event, including the color (in hexidecimal format) and the time in seconds
function LightEvent(color, time) {
    this.color = color;
    this.time = time;
}

//global variables af
var button;
var musicPlayer;
var audio;
var waveform;
var songWidth;

var lightEvents;
var pastLightEvents;
var upcomingLightEvents;

var songLength;
var currentTime;

var menu;
var menuState;
var activeMenu;

//calls when song is uploaded
function init() {
    console.log("init is being called");
    button = document.getElementById('play-pause-border');
    musicPlayer = document.getElementById('music-player');
    waveform = document.getElementById('music-waveform');
    //waveform.addEventListener("click", getClickXPosition, false);
    audio = document.getElementById('uploaded-song');
    songWidth = waveform.clientWidth;

    lightEvents = new Array();
    pastLightEvents = new Array();
    upcomingLightEvents = new Array();

    menu = document.querySelector("#context-menu");
    menuState = 0;
    activeMenu = "context-menu--active"

    //waveform click listeners
    waveform.addEventListener("contextmenu", contextMenuHelper);

    songLength = audio.duration;
    unfade(button);
    console.log(songLength)
}

/*
    //responding to clicks 'n stuff 
    //seeking, adding light events, etc.
*/
function getClickXPosition(e) {
    var position = waveform.getBoundingClientRect();
    var xPos = e.clientX - position.left;
    //console.log("click noted at x: " + xPos + "!");
    addLightEventWithPosition(xPos);
}

function contextMenuHelper(e) {
    e.preventDefault();
    toggleMenuOn();
}

function toggleMenuOn() {
    if ( menuState !== 1 ) {
        menuState = 1;
        menu.classList.add(activeMenu);
  } 
}
//at this point this function creates a light event of a random color
function addLightEventWithPosition(xPos) {
    var eventTime = (xPos / songWidth) * songLength;
    eventTime = Math.round(eventTime * 10) / 10;
    console.log("the event will be at " + eventTime + " seconds!");
    var randomColor = Math.floor((Math.random() * 10) + 1);
    switch(randomColor) {
        case 1:
            addLightEventInOrder(new LightEvent("#ff0000", eventTime))
            break;
        case 2:
            addLightEventInOrder(new LightEvent("#ffa500", eventTime));
            break;
        case 3:
            addLightEventInOrder(new LightEvent("#ffff00", eventTime));
            break;
        case 4:
            addLightEventInOrder(new LightEvent("#00ff00", eventTime));
            break;
        case 5:
            addLightEventInOrder(new LightEvent("#0000ff", eventTime));
            break;
        case 6:
            addLightEventInOrder(new LightEvent("#551a8b", eventTime));
            break;
        case 7:
            addLightEventInOrder(new LightEvent("#ffffff", eventTime));
            break;
        case 8:
            addLightEventInOrder(new LightEvent("#00ffff", eventTime));
            break;
        case 9:
            addLightEventInOrder(new LightEvent("#CD2990", eventTime));
            break;
        case 10:
            addLightEventInOrder(new LightEvent("#000", eventTime));
            break;
    }
}

function addLightEventInOrder(lightEvent) {
    console.log(lightEvent.color)
    if(upcomingLightEvents.length === 0) {
        //console.log("you're adding one to an empty list") 
        upcomingLightEvents[0] = lightEvent;
        //printArray();
    }
    else {
        if(lightEvent.time < upcomingLightEvents[0].time) {
            upcomingLightEvents.splice(0, 0, lightEvent);
            console.log("you're adding one at the beginning");
            //printArray();
        }
        else if(lightEvent.time > upcomingLightEvents[upcomingLightEvents.length - 1].time) {
            //console.log(upcomingLightEvents[length])
            //console.log("you're adding one at the end because " + lightEvent.time + " is greater than " + upcomingLightEvents[upcomingLightEvents.length - 1].time);
            upcomingLightEvents.push(lightEvent);
            //printArray();
            //console.log("you're adding one at the end, which should now be: " + console.log(upcomingLightEvents[length]))
        }
        else {
            for(var i = 0; i < upcomingLightEvents.length - 1; i ++) {
                if(upcomingLightEvents[i].time < lightEvent.time &&
                    upcomingLightEvents[i + 1].time > lightEvent.time) {
                    upcomingLightEvents.splice(i + 1, 0, lightEvent);
                    //console.log("you added one in between")
                    //printArray();
                    break;
                }
            }
        }
    }
    //console.log("the list of upcoming light events is now length " + upcomingLightEvents.length)
}


/*
    //this is what happens when you press play
*/
function play() {
    //var button = document.getElementById('play-pause-border');
    //var musicPlayer = document.getElementById('music-player');
    //audio = document.getElementById('uploaded-song');
    if (audio.paused) {
        audio.play();
        setInterval(function(){ checkForLightEvent(audio) }, 100);//runs every...something

        button.style.backgroundColor = '#efefef';
        musicPlayer.style.backgroundColor = '#000';
    }else{
        audio.pause();

        button.style.backgroundColor = '#34495e';
        musicPlayer.style.backgroundColor = '#34495e';
    }
}

function checkForLightEvent(audio) {
    //console.log("is this even working?")
    //currentTime = Math.round(audio.currentTime);
    currentTime = Math.round(audio.currentTime * 10) / 10;
    //console.log(currentTime)
    /*if(upcomingLightEvents.length > 0) { 
        //console.log(currentTime + " " + upcomingLightEvents[0].time);
        if(currentTime === upcomingLightEvents[0].time) {
            runEvent(upcomingLightEvents[0]);
            pastLightEvents[pastLightEvents.length] = upcomingLightEvents.splice(0, 1);
        }
    }*/
    for(var i = 0; i < upcomingLightEvents.length; i++) {
        //console.log("current time is " + currentTime + " whereas the next event is at " + upcomingLightEvents[i].time);
        if(currentTime < upcomingLightEvents[i].time) {
            //console.log("nigga we out") 
            break;
        }
        else if(currentTime === upcomingLightEvents[i].time) {
            runEvent(upcomingLightEvents[i]);
            pastLightEvents[pastLightEvents.length] = upcomingLightEvents.splice(0, 1);
            i--;
            //console.log("Size of upcomingLightEvents: " + upcomingLightEvents.length);
            //console.log("Size of pastLightEvents: " + pastLightEvents.length);
        }
    }
}

function runEvent(lightEvent) {
    //var musicPlayer = document.getElementById('music-player');
    //console.log(lightEvent.color)
    musicPlayer.style.backgroundColor = lightEvent.color;
    console.log("The color ran at " + lightEvent.time + " is " + lightEvent.color);
}

/*
    //testing functions
*/
//testing! prints out all times in an array, in order
function printArray() {
    var arrayString = "";
    var lightEvent = "";
    for(var i = 0; i < upcomingLightEvents.length; i ++) {
        lightEvent = upcomingLightEvents[i].time.toString();
        arrayString = arrayString.concat(lightEvent + ", ")
    }
    console.log(arrayString)
}

/*
    //something something frontend functions
*/
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

