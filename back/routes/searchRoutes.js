var path = require('path'),
    searchController = require('../controllers/searchController.js')

module.exports = function(app) {
  app.get('/search', searchController.getHits);
  // app.post('/search', searchController.getHits);
}