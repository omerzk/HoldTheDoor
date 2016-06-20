/**
 * Created by romcohen on 6/20/16.
 */
var mongoose = require('mongoose');
var GameModel = require('./Game.js');


function DB(url) {

    var db;
    var dbURL = url;

    this.connect = function(onConnection) {
        mongoose.connect(dbURL);
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', onConnection);
    };

    this.fillGames = function(onFind) {
        GameModel.find({}, onFind);
    };

    this.findOne = function(id2Find, onFind) {
        GameModel.findOne({id: id2Find}, onFind)
    }

}
module.exports = DB;