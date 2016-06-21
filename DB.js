/**
 * Created by romcohen on 6/20/16.
 */
var mongoose = require('mongoose');
var GameModel = require('./models/Game.js');
var Game = require('./Game.js');
var dbURL = 'mongodb://thrisno:clod@ds036789.mlab.com:36789/dibi';


function DB() {
    var db;

    /**
     * connect to remote db
     * @param onConnection
     */
    this.init = function (onInit) {
        mongoose.connect(dbURL);
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', onInit);
    };

    /**
     * generate games based on db records
     * @param onFill
     */
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

    /**
     * update DB instance of game
     * @param game
     * @param turn
     * @param story
     */
    this.updateFromGame = (game, turn, story) => {
        GameModel.findOne(game.id, function (err, gameFound) {
            if (err) return console.log(err);
            //console.log(gameFound);
            gameFound.turnsLeft = game.linesLeft;
            gameFound.curTurn = turn;
            gameFound.story = story;
            gameFound.save(function (err) {
                if (err) return console.log(err);
                console.log('Game successfully updated!');
            });
        });

    };

    /**
     * create DB instance of game object
     * @param gameName
     * @param lines
     */
    this.createDBGame = (gameName, lines)=> {
        new GameModel({
            id: gameName,
            turnsLeft: lines,
            curTurn: 0,
            players: [],
            story: []
        }).save(function (err, mongoGame) {
            if (err) return console.error(err);
        });
    };

    /**
     * remove a game record from the DB
     * @param game
     */
    this.removeFromDB = (game)=> {
        GameModel.findOne(game.id, function (err, gameFound) {
            if (err || gameFound == null)  return console.log(err);
            gameFound.remove(function (err) {
                if (err) return console.log(err);
                console.log('Game successfully deleted!');
            });
        });
    };
    this.addPlayer = (gameId, player)=> {
        GameModel.findOne(gameId, function (err, gameFound) {
            if (err) throw err;
            gameFound.players.push(player);
            gameFound.save(function (err) {
                if (err) throw err;
                console.log('Game successfully added a player to DB!');
            });
        });
    }

    this.updateDBPlayers = (game) => {
        GameModel.findOne(game.id, function (err, gameFound) {
            if (err) return console.log(err);
            gameFound.players = game.players;
            gameFound.save(function (err) {
                if (err) return console.log(err);
                console.log('Game successfully added a player to DB!');
            });
        });
    };
    this.findOne = function (id2Find, onFind) {
        GameModel.findOne({id: id2Find}, onFind)
    }

}
module.exports = DB;