'use strict';

// dependencies

var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    pkg = require('../package.json'),
    chalk = require('chalk'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    csrf = require('csurf');

require('./services/mongoose.js');

var db = mongoose.connection;

// express middleware, etc.

var app = express(),
  httpServer = http.createServer(app);

app.set('port', process.env.PORT || 1337);
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, '../front/public/images/favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.disable('x-powered-by');

// function csrfValue(req) {
//   return (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
// }

// app.use(csrf({value: csrfValue}));
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

// routes

require('./routes/')(app);

// start crawlers
// require('./crawlers/mturk-runner.js');

if (process.argv.indexOf('mturk') !== -1) {
    require('./crawlers/mturk-runner.js');
}

if (process.argv.indexOf('turko') !== -1) {
    require('./crawlers/turkopticon-runner.js')(true);
}

httpServer.listen(app.get('port'), function() {
  console.log(chalk.green('Express HTTP server listening on port ' + app.get('port')));
});