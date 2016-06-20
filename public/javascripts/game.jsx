/**
 * Created by omer on 15/06/2016.
 */
var serverAddr = 'http://sentgame.southeastasia.cloudapp.azure.com/';
var socket = io.connect(serverAddr);

var mySentence = $('#mySentence');
var clock = new Clock("#clockdiv", endTurn);
var lastSentence = $('#lastSentence');
var curPlayer = null;
var gameName = sessionStorage.getItem('gameName');
var playerName = sessionStorage.getItem('name');
var backUp = '';
if (playerName == null) {
    window.location = '/';
}
else if (gameName == null) {
    window.location = '/games';
}

$(document).ready(()=> {
    $('#gameName').text("Game: " + gameName);
    $('#inputForm').submit(function submitSentence(evt) {
        evt.preventDefault();
        endTurn(mySentence.val());
    })
});

function endTurn(sentence) {
    clock.stop();
    backUp = sentence;
    console.log("endTurn" + sentence);
    mySentence.prop('disabled', true);
    mySentence.val('');
    mySentence.blur()
    if (sentence !== null)socket.emit('submit', {sentence: sentence});
}

socket.on('connect', () => {
    socket.emit("HELLO", {name: playerName, game: gameName});
});

socket.on('reconnect', () => {
    socket.emit("reHELLO", {name: playerName, game: gameName});
    if (that.state.playerList[turn] == playerName && backUp != '') {
        socket.emit('submit', {sentence: backUp})
    }
});



socket.on('start turn', (data) => {
    var sentence = data.lastSentence;
    if (!mySentence.disabled) clock.stop();//in case the server crashed - gives the user an extra 2 minutes.
    mySentence.prop('disabled', false);
    console.log(lastSentence.val());
    lastSentence.val(sentence);
    var start = new Date();
    start.setMinutes(start.getMinutes() + 2);
    clock.countdown(start);
    mySentence.focus();
    console.log('sentence' + sentence)

});

socket.on('Game End', (data) => {
    clock.stop();
    var storyArea = $('#storyArea');
    storyArea.show();
    storyArea.val(data.story);
    mySentence.hide();
    lastSentence.hide();
    $('#butt').hide();
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
        socket.on('turn', (data) => {
            curPlayer = data.turn;
            this.setState({playerList: this.state.playerList, curPlayer: curPlayer});
            console.log('turn', curPlayer)
        });
    }


    render() {
        console.log(this.state.playerList)
        var players = this.state.playerList.map((playerName, i) => {
            var style = curPlayer === i ? {backgroundColor: '#d9ffe6', 'font-weight': 'large'} : {};
            var prefix = curPlayer === i ? 'Current Player: ' : '';
            return (
                <tr key={i} style={style}>
                    <td data-th="Player">{prefix + playerName}</td>
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
