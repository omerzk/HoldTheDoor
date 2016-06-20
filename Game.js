function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = -1;
    this.players = [];
    this.linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var that = this;
    var flow;
    sockets[id] = {};

    /**
     * loads a game from i'ts db repr;
     */

    this.updatefromDB = function (dbGame) {
        this.id = dbGame.id;
        story = dbGame.story;
        turn = dbGame.curTurn;
        this.players = dbGame.players;
        this.linesLeft = dbGame.turnsLeft;
    };
    /**
     * delete references to the game and inform all players of game end and  resulting story;
     */

    function endGame() {
        delete activeGames[that.id];
        // Find and delete this Game from the DB
        io.sockets.in(that.id).emit('Game End', {story: fullStory()});
        dataBase.removeFromDB(that);
    }

    /**
     * advance to the game's next turn
     * @returns {*}
     */

    function advance() {
        if (done() || that.players.length === 0) {
            endGame();
        }
        else {
            var next = nextPlayer();
            if (sockets[that.id][that.players[next]] == null) return endGame();//no more players in game
            else turn = next;

            dataBase.updateFromGame(that, turn, story);

            io.sockets.in(that.id).emit("turn", {turn: turn});
            if (sockets[that.id][that.players[turn]] != null) {
                console.log('start!')
                sockets[that.id][that.players[turn]].emit("start turn", {lastSentence: story[story.length - 1]});
            }

            flow = setTimeout(advance, turnDuration);
        }
    }

    /**
     * process a users submission
     */
    this.submitSentence = function (sentence, player) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        console.log('submit', player, that.players[turn]);
        if (player === that.players[turn]) {
            clearTimeout(flow);
            if (sentence != null && !done()) {
                story.push(sentence);
                that.linesLeft--;
            }
            advance()
        }
    };

    this.addPlayer = (player)=> {
        that.players.push(player);
        if (that.players.length == 1) {
            advance();//start game
        }
        else {
            //update new player of current player
            sockets[that.id][player].emit('turn', {turn: turn});
        }
    };

    this.currentPlayer = ()=> that.players[turn];

    this.removePlayer = (playerName) => {
        var player = this.currentPlayer();
        remove(that.players, playerName);
        turn--;
        if (player == playerName) advance();


    };

    function done() {
        return that.linesLeft == 0;
    }

    function fullStory() {
        return story.join("\n")
    };

    /**
     * find next available player
     * @returns {number}
     */
    function nextPlayer() {
        var next = turn;
        do {
            next = (next + 1) % that.players.length;
        } while (next !== turn && sockets[that.id][that.players[next]] == null);
        return next;
    }
}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}