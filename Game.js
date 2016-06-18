var GameModel = require('./models/Game.js');
//var mongoose = require('mongoose');

function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = 0;
    this.players = [];
    this.linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var flow = setTimeout(advance, turnDuration);
    var that = this;

    this.updatefromDB = function (mongoGame) {
        this.id = mongoGame.id;
        story = mongoGame.story;
        turn = mongoGame.curTurn;
        players = mongoGame.players;
        linesLeft = mongoGame.turnsLeft;
    };

    function advance() {
        if (done()) {
            delete activeGames[that.id];
            // Find and delete this Game from the DB
            var st = fullStory();
            io.sockets.in(that.id).emit('Game End', {story: st});
            GameModel.findOne({ id: that.id }, function(err, gameFound) {
                if (err) throw err;
                gameFound.remove(function(err) {
                    if (err) throw err;
                    console.log('Game successfully deleted!');
                });
            });
        }
        else {
            turn = (turn + 1) % that.players.length;
            // Find and update the game, turns left and story
            console.log('id: ' + that.id);
            GameModel.findOne({id: that.id}, function (err, gameFound) {
                if (err) throw err;
                console.log(gameFound);
                gameFound.turnsLeft = that.linesLeft;
                gameFound.curTurn = turn;
                gameFound.story = story;
                gameFound.save(function (err) {
                    if (err) throw err;
                    console.log('Game successfully updated!');
                });
            });
            io.sockets.in(that.id).emit("turn", {turn: turn});
            sockets[that.players[turn]].emit("start turn", {lastSentence: story[story.length - 1]});
            flow = setTimeout(advance, turnDuration);
        }
    }

    this.submitSentence = function (sentence) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        clearTimeout(flow);
        if (sentence != null && !done()) {
            story.push(sentence);
            that.linesLeft--;
        }
        advance()
    };


    this.addPlayer = (player)=> that.players.push(player);
    this.removePlayer = (playerName) => remove(that.players, playerName);
    function done() {
        return that.linesLeft == 0;
    }

    var fullStory = () => {
        a = story.slice();
        a.shift();
        return a.join("\n")
    };

}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}