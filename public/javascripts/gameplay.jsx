/**
 * Created by omer on 02/06/2016.
 */
var Pubnub = require('pubnub');
var pubnub = Pubnub.init({
    publish_key: 'pub-c-e2cc1a74-98ce-4ec3-b0c5-86b56952c633',
    subscribe_key: 'sub-c-dca8ae5a-28bb-11e6-b700-0619f8945a4f',
    name: ""
});

class GameBoard extends React.Component {
    constructor() {
        super();
        this.url = '/gameplay';
        this.dataType = 'json';
        this.state = {activeGames: []};
        var that = this;
        pubnub.subscribe({
            channel: 'main_channel',
            message: (activeList) => {
                that.setState({activeGames: activeList});
            }
        });
    }


    newGame(evt) {
        //TODO:add animation?
        //TODO: add UserID... needed to create an ad-hoc connection.
        evt.preventDefault();
        var numTurns = $('Turns')[0].value;
        var that = this;
        $.ajax({
            url: that.url,
            data: JSON.stringify({turns: numTurns}),
            dataType: that.dataType,
            method: "POST",
            success: (response) => {
                console.log("success");
                console.log(response);

            },
            error: BulletinBoard.requestError
        });
    }

    static requestError(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
            window.location = "/enter.jade";
        }
        console.log("AddGame message - Ajax Error: " + textStatus, errorThrown);
    }

    //deleteMessage(messageIdx){
    //    var that = this;
    //    $.ajax({
    //        url: that.url,
    //        data: JSON.stringify({messageId:that.state.messages[messageIdx].id}),
    //        dataType: that.dataType,
    //        method:"DELETE",
    //        success: (response) => {
    //            var tmp = that.state.messages;
    //            tmp.splice(messageIdx,1);
    //            if(response.removed) tmp.push(response.append);
    //            that.setState({messages: tmp});
    //        },
    //        error:BulletinBoard.requestError
    //    })
    //}

    render() {
        var itemsList = this.state.activeGames.map((item, i) => {
            return (
                <tr key={i}>
                    <td data-th="Time">{item.time}</td>
                    <td data-th="Lines">{item.username}</td>
                    <td data-th="Message">{item.message}</td>
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
                                    <form onSubmit={this.newGame.bind(this)}><input id="Turns" placeholder="#Turns"/>
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
                        <th>Time</th>
                        <th>Lines</th>
                        <th>Message</th>
                    </tr>
                    </thead>
                    <tbody>{itemsList}</tbody>
                </table>
            </section>)
    }

}


ReactDOM.render(React.createElement(GameBoard), document.getElementById("gameListContainer"));