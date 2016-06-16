/**
 * Created by omer on 16/06/2016.
 */
function GameController() {
    function attach(socket) {
        var game = activeGames[userToGame[socket.player]];
        game.addPlayer(socket.player);
        return game.id;
    }

    function advance(socket, sentence) {
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
}
