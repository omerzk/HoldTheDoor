function Game(lines, id) {
    this.id = id;
    var story = [""];
    var turn = 0;
    this.players = [];
    this.linesLeft = lines;
    var turnDuration = 120 * 1000 * 3;
    var flow = setTimeout(advance, turnDuration);

    function advance() {
        if (done()) {
            delete activeGames[this.id]
            io.sockets.in(this.id).emit('Game End', {story: fullStory()});
        }
        else {
            turn = (turn + 1) % this.players.length;
            io.sockets.in(this.id).emit("turn", {turn: turn});
            sockets[this.players[turn]].emit("start turn", {lastSentence: story[story.length - 1]});
            flow = setTimeout(advance, turnDuration);
        }
    }

    this.submitSentence = function (sentence) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        clearTimeout(flow);
        if (sentence != null && !done()) {
            story.push(sentence);
            this.linesLeft--;
        }
        advance()
    };


    this.addPlayer = (player)=> this.players.push(player);
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