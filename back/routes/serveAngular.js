var chalk = require('chalk'),
    path = require('path');

// serve the main view to any route that is associated with angular

module.exports = function(app) {

  // todo: load from a JSON? Probably not... since there's no reason to integrate with gulp
  var angularRoutes = ['/'];
  var angularPath = path.resolve(__dirname, '../../front/public/partials/main.html')

  angularRoutes.forEach(function(route) {
    app.get(route, function(req, res) {
      res.sendFile(angularPath);
    });
  });
};