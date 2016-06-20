/**
 * Created by omer on 02/06/2016.
 */

class GameBoard extends React.Component {

    constructor() {
        super();
        this.state = {activeGames: []};
        this.getGames();
        this.inter = setInterval(this.getGames.bind(this), 5000);
    }

    getGames() {
        $.ajax({
            url: '/games/active',
            dataType: 'json',
            'Content-type': 'application/json',
            method: "GET",
            success: (res) => {
                this.setState({activeGames: res});
            },
            error: GameBoard.requestError
        });
    }


    newGame(evt) {
        evt.preventDefault();
        clearInterval(this.inter);
        var numTurns = $('#Turns').val();
        var gameName = $('#GameName').val();
        var name = sessionStorage.getItem('name');
        sessionStorage.setItem("gameName", gameName);
        console.log({turns: numTurns, name: name, gamename: gameName});
        $.ajax({
            url: '/games/newGame',
            data: ({turns: numTurns, name: name, gamename: gameName}),
            dataType: "text",
            method: "POST",
            success: (response) => {
                console.log("success");
                window.location = "/game"
            },
            error: (jqXHR, textStatus, errorThrown) => {
                GameBoard.requestError('Game name is in Use', jqXHR);
            }
        });
    }


    joinGame(k) {
        return () => {
            clearInterval(this.inter);
            console.log('join game');

            var name = sessionStorage.getItem('name');
            var gameName = this.state.activeGames[k].id;
            sessionStorage.setItem("gameName", gameName);

            $.ajax({
                url: '/joinGame',
                data: ({name: name, gameName: gameName}),
                dataType: "text",
                method: "POST",
                success: (response) => {
                    console.log("success");
                    window.location = "/game"
                },
                error: (jqXHR, textStatus, errorThrown)=> {
                    GameBoard.requestError('Username already in Game', jqXHR);
                    this.inter = setInterval(this.getGames.bind(this), 5000);//restart update
                }
            });
        }
    }


    static requestError(error, jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 409) {
            alert(error);
        }
        console.log("AddGame message - Ajax Error: " + textStatus, errorThrown);
    }


    render() {
        var gameList = Object.keys(this.state.activeGames).map((key, i) => {
            return (
                <tr key={i} onClick={this.joinGame(key)}>
                    <td data-th="Game Name">{this.state.activeGames[key].id}</td>
                    <td data-th="Lines">{this.state.activeGames[key].linesLeft}</td>
                    <td data-th="#Players">{this.state.activeGames[key].players.length}</td>
                </tr>
            )
        });
        return (
            <section>
                <div className="newGameDiv">
                    <form onSubmit={this.newGame.bind(this)}>
                        <input id="GameName" placeholder="GameName" type="text" required/>
                        <input id="Turns" placeholder="#Turns" type="number" required/>
                        <button>Create</button>
                    </form>
                </div>
                <table id="GameBoard">
                    <colgroup>
                        <col style={{width:'20%'}}></col>
                        <col style={{width:'20%'}}></col>
                        <col style={{width:'50%'}}></col>
                        <col style={{width:'10%'}}></col>
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
            </section>)
    }

}


ReactDOM.render(React.createElement(GameBoard), document.getElementById("gameListContainer"));
