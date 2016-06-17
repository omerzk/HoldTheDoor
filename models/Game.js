var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Game = new Schema({
    id: String,
    turnsLeft: Number,
    curTurn: Number, // update rule: curTurn++ % players.length()
    players: [String],
    story: [String]
});

module.exports = mongoose.model('GameModel', Game);