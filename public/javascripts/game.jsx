/**
 * Created by omer on 15/06/2016.
 */
var serverAddr = 'http://localhost:3000';
var socket = io.connect(serverAddr);

var mySentence = $('mySentence');
var clock = new Clock();
var lastSentence = $('lastSentence');

function endTurn(sentence) {
    mySentence.disabled = true;
    mySentence.value = '';
    socket.emit('end Turn', {input: sentence});
}

function submitSentence(evt) {
    evt.preventDefault();
    endTurn(mySentence.value);
}

socket.on('connect', () => {
    socket.emit("new Name", {name: window.name});
});

socket.on('start turn', (sentence) => {
    if (!mySentence.disabled) clock.stop();//in case the server crashed - gives the user an extra 2 minutes.
    mySentence.disabled = false;
    lastSentence.value = sentence;
    var start = new Date();
    clock.countdown(start.setMinutes(start.getMinutes() + 2), endTurn);
});

socket.on('Game End', (story) => {
    $('storyArea').value = story;
    $('storyArea').hidden = false;
});

//window.onbeforeunload =