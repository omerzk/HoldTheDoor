/**
 * Created by omer on 02/06/2016.
 */

class GameBoard extends React.Component {
    constructor() {
        super();
        this.url = '/games/active';
        this.dataType = 'json';
        this.state = {activeGames: []};
        var that = this;
        $.ajax({
            url: that.url,
            dataType: that.dataType,
            'Content-type': 'application/json',
            method: "GET",
            success: (res) => {
                console.log(res);
                that.setState({activeGames: res});
            },
            error: GameBoard.requestError
        })

    }


    newGame(evt) {
        evt.preventDefault();
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
                console.log(response);
                window.location = "/game"
            },
            error: GameBoard.requestError
        });
    }


    joinGame(k) {
        return () => {
            console.log(k);
            console.log(this.state.activeGames)
            var name = sessionStorage.getItem('name');
            console.log('join game');
            var gameName = this.state.activeGames[k].id;
            sessionStorage.setItem("gameName", gameName);
            $.ajax({
                url: '/joinGame',
                data: ({name: name, gameName: gameName}),
                dataType: "text",
                method: "POST",
                success: (response) => {
                    console.log("success");
                    console.log(response);
                    window.location = "/game"
                },
                error: GameBoard.requestError
            });
        }
    }


    static requestError(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
            window.location = "/";
        }
        console.log("AddGame message - Ajax Error: " + textStatus, errorThrown);
    }


    render() {
        console.log(this.state.activeGames)
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
                <div className="side-panel a">
                    <ul>
                        <li>
                            <ul id="addPanel">
                                <li >
                                    <form onSubmit={this.newGame.bind(this)}>
                                        <input id="GameName" placeholder="GameName" type="text" required/>
                                        <input id="Turns" placeholder="#Turns" type="number" required/>
                                        <button>Create</button>
                                    </form>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <table id="GameBoard">
                    <caption>GameBoard</caption>
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
