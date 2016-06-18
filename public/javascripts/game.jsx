/**
 * Created by omer on 15/06/2016.
 */
var serverAddr = 'http://localhost:3000';
var socket = io.connect(serverAddr);
var mySentence = $('#mySentence');
var clock = new Clock("#clockdiv");

var lastSentence = $('#lastSentence');
var curPlayer = null;
var gameName = sessionStorage.getItem('gameName');
var playerName = sessionStorage.getItem('name');


$(document).ready(()=> {
    $('#inputForm').submit(function submitSentence(evt) {
        evt.preventDefault();
        console.log("this place");
        endTurn(mySentence.val());
    })
});

function endTurn(sentence) {
    console.log("endTurn" + sentence);
    mySentence.disabled = true;
    mySentence.val('');
    if (sentence !== null)socket.emit('submit', {sentence: sentence});
}

socket.on('connect', () => {
    socket.emit("HELLO", {name: playerName, game: gameName});
});

socket.on('reconnect', () => {
    socket.emit("reHELLO", {name: playerName, game: gameName});
});

socket.on('turn', (data) => {
    curPlayer = data.nextPlayer;
});

socket.on('start turn', (data) => {
    var sentence = data.lastSentence;
    if (!mySentence.disabled) clock.stop();//in case the server crashed - gives the user an extra 2 minutes.
    mySentence.disabled = false;
    console.log(lastSentence.val());
    lastSentence.val(sentence);
    var start = new Date();
    start.setMinutes(start.getMinutes() + 2);
    clock.countdown(start, endTurn);
    console.log('sentence' + sentence)

});

socket.on('Game End', (data) => {
    var storyArea = $('#storyArea');
    storyArea.show();
    storyArea.val(data.story);
});

//window.onbeforeunload =


class PlayerList extends React.Component {
    constructor() {
        super();
        this.state = {playerList: [], curPlayer: null};
        socket.on('Player List', (data)=> {
            this.setState({playerList: data.playerList, curPlayer: data.curPlayer});
            console.log(data.playerList)
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
                <table id="PlayerTable">
                    <colgroup>
                        <col></col>
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
