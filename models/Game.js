var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Game = new Schema({
    id: Number,
    turnsLeft: Number,
    curTurn: Number, // update rule: curTurn++ % players.length()
    timer: Number,// number in 0 - 120
    players: [String]


});

module.exports = mongoose.model('GameModel', Game);