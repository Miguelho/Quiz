var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');

var partials = require('express-partials');
var methodOverride = require('method-override');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('Quiz 2015')); // Añade semilla 'Quiz 2015' para cifrar cookie
app.use(session(
  {
    secret: 'keyboard cat', cookie: { maxAge: 120000 }
  }
));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
//helpers dinámicos:
app.use(function(req,res,next){
  //guardar path en session.redir para después de login.
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir= req.path;
  }

// Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

var now = Date.now();
var diff=0;
var last;

app.use(function (req, res, next) {
  var sess= req.session;
  console.log('Tiempo para expirar sesión'+req.session.cookie.maxAge); // log del tiempo de vida de la cookie
  if(sess.user){
      console.log('estoy logeado!!!!');
      last = Date.now();
      diff= now-last;
      if (diff>120000){
        console.log('Han pasado más de dos segundos, te desconecto!!!');
      }
  }
  console.log('Momento :' +now + 'Momento-1 : '+ last);
  next();
});


app.use('/', routes);

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
      error: err,
      errors: []
    });
  });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});




module.exports = app;
