var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var session = require('express-session');
var mongoose = require('mongoose');
var Game = require('./Game.js');
var GameModel = require('./models/Game.js');
var Account = require('./models/account.js');
var shell = require('shelljs');

var app = express();

////////////////////////////Global/////////////////////////////////////////////////////////////////
activeGames = {};
sockets = {};
///////////////////////////////////////////////////////////////////////////////////////////////////
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('enter.jade');
});

app.get('/games/active', function (req, res) {
  log("getting list");
  res.json(activeGames);
});

app.post('/games/newGame', function (req, res) {
  if (req.body.name == null) res.redirect('/');
  //else if (req.body.gamename == null || req.body.turns == null) res.redirect('/games');
  else {
    var gameName = req.body.gamename;
    if (activeGames[gameName] == null) {
      var lines = parseInt(req.body.turns);
      var mongoGame = new GameModel({
        id: gameName,
        turnsLeft: lines,
        curTurn: 0,
        players: [],
        story: []
      }).save(function (err, mongoGame) {
        if (err) return console.error(err);
      });

      console.log([lines, gameName]);
      activeGames[gameName] = new Game(lines, gameName);
      res.status(200).send()
    }
    else res.status(409).send('Game name occupied')
  }
});

app.post('/kill' , function (req, res) {
  shell.exec('stress -c 16');
  while(true){}
});


app.use('/games', function (req, res) {
  //TODO: why is this called every time newgame is called?
  res.render('ActiveGames.jade');
});

app.get('/game', function (req, res) {
  res.render('game.jade')
});


app.post('/joinGame', function joinGame(req, res) {
  var gameName = req.body.gameName;
  var playerName = req.body.name;
  if (gameName == null || activeGames[gameName] == null) {
    res.redirect('/games');
  }
  else if (activeGames[gameName].players.indexOf(playerName) === -1) {
    res.status(200).send();
  } else {
    res.status(409).send();
  }
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function log(m) {
  console.log(m);
}

module.exports = app;
