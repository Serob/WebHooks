const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //test true

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const message = req.app.get('env') === 'development' ? err.message : {};

  // render the error page
  res.status(err.status || 500);
  res.json(message);
});

module.exports = app;
