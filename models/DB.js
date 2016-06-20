/**
 * Created by romcohen on 6/20/16.
 */
var mongoose = require('mongoose');
var GameModel = require('./Game.js');
var Game = require('../Game.js');


function DB(url) {

    var db;
    var dbURL = url;

    this.connect = function(onConnection) {
        mongoose.connect(dbURL);
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', onConnection);
    };

    this.fillGames = function (onFill) {
        GameModel.find({}, function (err, games) {
            for (var i = 0; i < games.length; i++) {
                var gameName = games[i].id;
                var newGame = new Game(games[i].turnsLeft, games[i].id);
                newGame.updatefromDB(games[i]);
                activeGames[gameName] = newGame;
            }
            onFill()
        });
    };

    this.findOne = function(id2Find, onFind) {
        GameModel.findOne({id: id2Find}, onFind)
    }

}
module.exports = DB;