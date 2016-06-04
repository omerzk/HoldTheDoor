var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var passport = require('passport');
var CustomStrategy = require('passport-custom');
var session = require('express-session');
var mongoose = require('mongoose');
var Game = require("./Game");
var Pubnub = require('pubnub');


var app = express();

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

var pubnub = Pubnub.init({
  publish_key: 'pub-c-e2cc1a74-98ce-4ec3-b0c5-86b56952c633',
  subscribe_key: 'sub-c-dca8ae5a-28bb-11e6-b700-0619f8945a4f'
});


//var dbReady = false;

////Init remote mongodb
//mongoose.connect('mongodb://thrisno:clod@ds036789.mlab.com:36789/dibi');
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function () {
//  console.log("DB ready");
//  dbReady = true;
//});
//
//
//// passport config
//passport.use('name', new CustomStrategy(function(req, cb){
//  db.findOne({
//    username: req.body.username
//  }, function (err, user) {
//    done(err, user);
//  });
//}));
var activeGameList = [];

app.get('/', function (req, res) {
  res.render('enter.jade');
});

//to remove auth make failureRedirect direct to wherever you want
//app.post('/login', passport.authenticate('name', {failureRedirect: '/', successRedirect: '/games'}));

////also comment-out this line
//app.all('*', require('connect-ensure-login').ensureLoggedIn('/'), function (a, b, next) {
//  next();
//});

app.get('/game/:name/:lines', function (req, res) {
  if (req.params.name == null) res.redirect('enter.jade')
  else if (req.params.turns == null) res.redirect('games.jade')
  else {
    var name = req.params.name;
    var lines = parseInt(req.params.lines);
    activeGameList.push(new Game(lines, name + '_Game'));
    pubnub.subscribe({
      channel: name + '_Game',
      message: (m) => {

      }
    });
    res.render('game.jade');
  }
  //} else {
  //  res.render('enter.jade');
  //}
});

app.get('/games/active', function (req, res) {
  res.json(activeGameList)
});

//TODO: replace with an input in the active games screen
//app.get('/games/new', function (req, res) {
//  res.render('new_game.jade');
//});
//
//app.get('/game', function (req, res) {
//  res.render('game.jade');
//});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
