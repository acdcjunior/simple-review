const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const committers = require('./routes/committers');
const jenkins = require('./routes/jenkins');
const inject = require('./routes/inject');
const rpc = require('./routes/rpc');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




const BACK_END_CONTEXT = '/back-end-review';
app.use(`${BACK_END_CONTEXT}/index`, require('./routes/index'));

app.use(`${BACK_END_CONTEXT}/committers`, committers);
app.use(`${BACK_END_CONTEXT}/jenkins`, jenkins);
app.use(`${BACK_END_CONTEXT}/inject.js`, inject);
app.use(`${BACK_END_CONTEXT}/rpc`, rpc);

// noinspection JSUnresolvedVariable
app.use(`${BACK_END_CONTEXT}/splash`, require('./build/apresentacao/splash/splash').splashRouter);

app.use(`${BACK_END_CONTEXT}/public`, express.static(path.join(__dirname, 'public')));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found! Request: ' + JSON.stringify(req, null, '\t'));
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
