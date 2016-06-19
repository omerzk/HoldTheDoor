var GameModel = require('./models/Game.js');
//var mongoose = require('mongoose');

function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = -1;
    this.players = [];
    this.linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var that = this;
    var flow;
    var first = true;
    sockets[id] = {};

    this.updatefromDB = function (mongoGame) {
        this.id = mongoGame.id;
        story = mongoGame.story;
        turn = mongoGame.curTurn;
        this.players = mongoGame.players;
        this.linesLeft = mongoGame.turnsLeft;
    };

    function endGame() {
        delete activeGames[that.id];
        // Find and delete this Game from the DB
        var st = fullStory();
        io.sockets.in(that.id).emit('Game End', {story: st});
        GameModel.findOne({id: that.id}, function (err, gameFound) {
            if (err) throw err;
            gameFound.remove(function (err) {
                if (err) throw err;
                console.log('Game successfully deleted!');
            });
        });
    }
    function advance() {
        if (done() || that.players.length === 0) {
            endGame();
        }
        else {
            console.log("pre-next");
            var next = nextPlayer();
            console.log("next", next);
            if (sockets[that.id][that.players[next]] == null) endGame();//no more players in game
            else turn = next;

            console.log('id: ' + that.id);
            GameModel.findOne({id: that.id}, function (err, gameFound) {
                if (err) throw err;
                //console.log(gameFound);
                gameFound.turnsLeft = that.linesLeft;
                gameFound.curTurn = turn;
                gameFound.story = story;
                gameFound.save(function (err) {
                    if (err) throw err;
                    console.log('Game successfully updated!');
                });
            });
            io.sockets.in(that.id).emit("turn", {turn: turn});
            sockets[that.id][that.players[turn]].emit("start turn", {lastSentence: story[story.length - 1]});
            flow = setTimeout(advance, turnDuration);
        }
    }

    this.submitSentence = function (sentence, player) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
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
        console.log(that.players)
        if (that.players.length == 1) {
            advance();
        }
    };
    this.currentPlayer = ()=> that.players[turn];
    this.removePlayer = (playerName) => {
        var player = this.currentPlayer();
        remove(that.players, playerName);
        turn--;
        if (player == playerName) advance();


    }

    function done() {
        return that.linesLeft == 0;
    }

    var fullStory = () => {
        return story.join("\n")
    };


    function nextPlayer() {
        var next = turn;
        do {
            next = (next + 1) % that.players.length;
        } while (next !== turn && sockets[that.id][that.players[next]] == null);
        console.log('next done')
        return next;
    }
}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}