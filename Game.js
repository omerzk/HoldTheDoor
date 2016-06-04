var MAX_SENTENCE_LEN = 63;

module.exports = class Game {

    constructor(lines, id) {
        this.id = id;
        this.story = [""];
        this.turn = 0;
        this.playerNum = 1;
        this.linesLeft = lines;
    }

    submitSentence(sentence) {
        console.assert(this.playerNum > 2, {message: "less then 2 players", playerNumber: this.playerNum});
        if (sentence != '' && sentence.length <= MAX_SENTENCE_LEN && this.linesLeft > 0) {
            this.story.append(sentence);
            this.linesLeft--;
            this.turn = (this.turn + 1) % this.playerNum;
            return true;
        }
        return false;
    }

    get fullStory() {
        if (this.linesLeft == 0)
            return this.story.join('\n');
    }

    get lastSentence() {
        return this.story[this.story.length - 1];
    }

}

