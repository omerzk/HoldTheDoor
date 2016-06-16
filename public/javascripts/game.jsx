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

socket.on('start turn', (data) => {
    var sentence = data.sentence;
    if (!mySentence.disabled) clock.stop();//in case the server crashed - gives the user an extra 2 minutes.
    mySentence.disabled = false;
    lastSentence.value = sentence;
    var start = new Date();
    clock.countdown(start.setMinutes(start.getMinutes() + 2), endTurn);
});

socket.on('turn', (data) => {

});
socket.on('Game End', (story) => {
    $('storyArea').value = story;
    $('storyArea').hidden = false;
});

//window.onbeforeunload =


class GameBoard extends React.Component {
    constructor() {
        super();
        this.state = {playerList: []};
        socket.emit('Player List')
        socket.on('Player list response', (data)=> {
                this.setState({playerList: data.playerList});
            }
        );
    }


    render() {
        console.log(this.state.playerList)
        var players = this.state.playerList.map((playerName, i) => {
            return (
                <tr key={i}>
                    <td data-th="Player">{playerName}</td>
                </tr>
            )
        });

        return (
        <table id="GameBoard">
            <caption>GameBoard</caption>
            <colgroup>
                <col></col>
            </colgroup>
            <thead>
            <tr>
                <th>Game Name</th>
                <th>Lines</th>
                <th>#Players</th>
            </tr>
            </thead>
            <tbody>{gameList}</tbody>
        </table>
        < / section >)
    }

}


ReactDOM.render(React.createElement(GameBoard), document.getElementById("gameListContainer"));
