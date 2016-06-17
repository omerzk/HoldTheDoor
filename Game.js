var GameModel = require('./models/Game.js');


function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = 0;
    var players = [];
    var linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var flow = setTimeout(advance, turnDuration);

    function advance() {
        if (done()) {
            delete activeGames[this.id]
            io.sockets.in(this.id).emit('Game End', {story: fullStory()});
            // Find and delete the game from the db
            GameModel.find({ id: this.id }, function(err, gameFound) {
                if (err) throw err;
                // object of the user
                gameFound.remove(function(err) {
                    if (err) throw err;
                    console.log('Game successfully deleted!');
                });
            });
        }
        else {
            turn = (turn + 1) % players.length;
            // Find and update the game, turns left and story
            GameModel.find({ id: this.id }, function(err, gameFound) {
                if (err) throw err;
                gameFound.turnsLeft = linesLeft;
                gameFound.curTurn = turn;
                gameFound.story = story;
                gameFound.save(function(err) {
                    if (err) throw err;
                    console.log('Game successfully updated!');
                });
            });
            io.sockets.in(this.id).emit("turn", {turn: turn});
            sockets[players[turn]].emit("start turn", {lastSentence: story[story.length - 1]});
            flow = setTimeout(advance, turnDuration);
        }
    }

    this.submitSentence = function (sentence) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        clearTimeout(flow);
        if (sentence != null && !this.done()) {
            story.push(sentence);
            linesLeft--;
        }
        advance()
    };


    this.addPlayer = (player)=> players.push(player);
    this.removePlayer = (playerName) => remove(this.players, playerName);
    function done() {
        return this.linesLeft == 0;
    }

    var fullStory = () => this.story.join();

}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}