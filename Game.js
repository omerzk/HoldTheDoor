var MAX_SENTENCE_LEN = 63;
function Game(lines, id) {
    this.id = id;
    this.story = [""];
    this.turn = 0;
    this.playerNum = 1;
    this.linesLeft = lines;

    this.submitSentence = function (sentence) {
        console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        if (sentence != '' && sentence.length <= MAX_SENTENCE_LEN && this.linesLeft > 0) {
            this.story.append(sentence);
            this.linesLeft--;
            this.turn = (this.turn + 1) % this.playerNum;
            return true;
        }
        return false;
    };

    this.addPlayer = () => this.playerNum++;
    this.removePlayer = () => this.playerNum--;

}
module.exports = Game;
