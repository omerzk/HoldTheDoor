var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  secret: 'ssshhhhh'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

var sess;
var userArray;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/',function(req,res){
  sess = req.session;
  req.session.id
  // If name exists redirect to games
  // else render index.html
  if(userArray[sess.id]) {
    /*
     * This line check Session existence.
     * If it existed will do some action.
     */
    res.redirect('/games');
  } else {
    res.render('enter.jade');
  }
});

app.post('/login',function(req,res){
  sess = req.session;
  userArray[sess.id] = req.body.name;
  res.end('done');
});

app.get('/games',function(req,res){
  sess = req.session;
  if(userArray[sess.id]) {
    res.render('games.jade');
  } else {
    res.render('enter.jade');
  }
});

app.get('/games/active',function(req,res){
  res.json(userArray)
});

app.get('/games/new',function(req,res){
  res.render('new_game.jade');
});

app.get('/game',function(req,res){
  res.render('game.jade');
});



module.exports = app;
