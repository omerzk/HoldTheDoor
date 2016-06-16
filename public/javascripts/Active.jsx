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
                that.setState({activeGames: res});
            },
            error: GameBoard.requestError
        })

    }


    newGame(evt) {
        //TODO:add animation?
        //TODO: add UserID... needed to create an ad-hoc connection.
        evt.preventDefault();
        var numTurns = $('input')[1].value;
        var GameName = $('input')[0].value;
        var name = sessionStorage.getItem('name');
        console.log(sessionStorage)
        $.ajax({
            url: '/games/newGame',
            data: ({turns: numTurns, name: name, gamename: GameName}),
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

    joinGame(evt) {
        var that = this;
        $.ajax({
            url: '/games/newGame',
            data: ({turns: numTurns, name: window.name, gamename: GameName}),
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
                <tr key={i} onclick={this.joinGame(key)}>
                    <td data-th="Game Name">{this.state.activeGames[key].id}</td>
                    <td data-th="Lines">{this.state.activeGames[key].linesLeft}</td>
                    <td data-th="#Players">{this.state.activeGames[key].playerNum}</td>
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
                                        <input id="GameName" placeholder="GameName"/>
                                        <input id="Turns" placeholder="#Turns"/>
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
