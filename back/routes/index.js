var chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    serveStatic = require('serve-static');

module.exports = function(app) {
  // do not cache (for hackathon)
  app.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

  // set up static routes
  app.use('/public', serveStatic(path.join(__dirname, '../../front/public'),
    {maxAge: 360000}));

  // loop through all other routes
  fs.readdirSync('./back/routes/').forEach(function(file) {
    if (file.match(/.+\.js/) != null && file !== 'index.js') {
      require('./' + file)(app);
    }
  });
};