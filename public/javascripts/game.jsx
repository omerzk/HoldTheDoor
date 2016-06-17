/**
 * Created by omer on 15/06/2016.
 */
var serverAddr = 'http://localhost:3000';
var socket = io.connect(serverAddr);
var mySentence = $('mySentence');
var clock = new Clock();
var lastSentence = $('lastSentence');
var curPlayer = null;
var gameName = sessionStorage.getItem('gameName');
var playerName = sessionStorage.getItem('name');

function endTurn(sentence) {
    mySentence.disabled = true;
    mySentence.value = '';
    socket.emit('end Turn', {input: sentence, game: gameName});
}

function submitSentence(evt) {
    console.log("this place")
    evt.preventDefault();
    endTurn(mySentence.value);
}

socket.on('connect', () => {
    socket.emit("HELLO", {name: playerName, game: gameName});
});

socket.on('reconnect', () => {
    socket.emit("HELLO", {name: playerName, game: gameName});
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
    curPlayer = data.nextPlayer;
});

socket.on('Game End', (story) => {
    $('storyArea').value = story;
    $('storyArea').hidden = false;
});

//window.onbeforeunload =


class PlayerList extends React.Component {
    constructor() {
        super();
        this.state = {playerList: [], curPlayer: null};
        socket.emit('Game Data', {game: gameName});
        socket.on('player List', (data)=> {
            this.setState({playerList: data.playerList, curPlayer: data.curPlayer});
            }
        );
    }


    render() {
        console.log(this.state.playerList)
        var players = this.state.playerList.map((playerName, i) => {
            var style = curPlayer === playerName ? {backgroundColor: '#c37dcc'} : {};
            return (
                <tr key={i} style={style}>
                    <td data-th="Player">{playerName}</td>
                </tr>
            )
        });

        return (
            <section>
                <table id="GameBoard">
                    <caption>GameBoard</caption>
                    <colgroup>
                        <col>Player</col>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>Player Name</th>
                    </tr>
                    </thead>
                    <tbody>{players}</tbody>
                </table>
            </section >)
    }

}


ReactDOM.render(React.createElement(PlayerList), document.getElementById("playerListContainer"));
