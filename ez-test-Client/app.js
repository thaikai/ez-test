const dotenv = require('dotenv');
var createError = require('http-errors');
var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var passport = require('passport')  
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// load environment variables from .env
dotenv.config({ path: '.env.example' });

// configure passport
require('./config/passport')(passport);
// view engine setup
app.set('views', __dirname+'/views/');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session

// application routes
require('./routes/index')(app, passport);
app.use("/legal", require("./routes/legal"));
app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/controllers", express.static(__dirname + '/controllers'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;