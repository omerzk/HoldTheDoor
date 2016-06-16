function Game(lines, id, creator) {
    this.id = id;
    this.story = [""];
    this.turn = 0;
    this.players = [creator];
    this.linesLeft = lines;

    this.submitSentence = function (sentence) {
        //console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        if (sentence != null && !this.done()) {
            this.story.append(sentence);
            this.linesLeft--;
        }
        this.turn = (this.turn + 1) % this.players.length;
        return this.players[this.turn];
    };

    this.addPlayer = (player)=>this.players.push(player);
    this.removePlayer = (playerName) => remove(this.players, playerName);
    this.done = () => this.linesLeft == 0;
    this.fullStory = () => this.story.join();
}
module.exports = Game;

function remove(arr, elem) {
    arr.splice(arr.indexOf(elem), 1);
}