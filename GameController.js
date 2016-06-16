/**
 * Created by omer on 16/06/2016.
 */
exports.g = function GameController() {
    this.attach = (socket)=> {
        var game = activeGames[userToGame[socket.player]];
        console.log(userToGame);
        console.log("player" + socket.player)
        console.log(game);
        game.addPlayer(socket.player);
        return game.id;
    }

    this.advance = (socket, sentence) => {
        var game = activeGames[userToGame[socket.player]];
        var nextPlayer = game.submitSentence(sentence);
        var event, data;
        if (game.done()) {
            event = 'End';
            data = {story: game.fullStory()};
        }
        else {
            event = "turn";
            data = {player: nextPlayer};
        }
        return
    }

    this.freeze = (socket) => {
        return null;
    }
};
