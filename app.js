var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://thrisno:clod@ds036789.mlab.com:36789/dibi');
var db = mongoose.connection;
var dbReady = false;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB ready");
  dbReady = true;
});

// Configure the local strategy for use by Passport.
passport.use(new Strategy(
    function (username, password, cb) {
      db.users.findByUsername(username, function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.password != password) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }));


// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true},
  secret: 'ko ko ka cho'
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/public',express.static(path.join(__dirname, 'public')));


var sess;
var userArray = {};

app.get('/', function (req, res) {
  res.render('enter.jade');
});

//to remove auth make failureRedirect direct to wherever you want
app.post('/login', passport.authenticate('local', {failureRedirect: '/', successRedirect: '/games'}));

//also comment-out this line
app.all('*', require('connect-ensure-login').ensureLoggedIn('/'), function (a, b, next) {
  next();
});

app.get('/games', function (req, res) {
  sess = req.session;
  console.log(sess.id);
  console.log(userArray);

  if (sess.id in userArray) {
    res.render('games.jade');
  } else {
    res.render('enter.jade');
  }
});

app.get('/games/active', function (req, res) {
  res.json(userArray)
});

app.get('/games/new', function (req, res) {
  res.render('new_game.jade');
});

app.get('/game', function (req, res) {
  res.render('game.jade');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
