var GameModel = require('./models/Game.js');

function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = 0;
    this.players = [];
    this.linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var flow = setTimeout(advance, turnDuration);
    var that = this;

    function advance() {
        if (done()) {
            delete activeGames[that.id]
            io.sockets.in(that.id).emit('Game End', {story: fullStory()});
        }
        else {
            turn = (turn + 1) % that.players.length;
            // Find and update the game, turns left and story
            //GameModel.find({id: that.id}, function (err, gameFound) {
            //    if (err) throw err;
            //    gameFound.turnsLeft = that.linesLeft;
            //    gameFound.curTurn = turn;
            //    gameFound.story = story;
            //    gameFound.save(function (err) {
            //        if (err) throw err;
            //        console.log('Game successfully updated!');
            //    });
            //});
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

    var fullStory = () => story.join();

}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}