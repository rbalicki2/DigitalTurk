var mongoose = require('mongoose'),
    pkg = require('../../package.json'),
    chalk = require('chalk');

// connect to mongoose (needs to be separate for running the crawlers separate from the server)

var MONGO_PORT = 27017;

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:' + MONGO_PORT + '/' + pkg.name;

mongoose.connect(uristring, function(err, res) {
  if (err) {
    console.log(chalk.red('ERROR connecting to ' + uristring));
    console.log(err);
  } else {
    console.log(chalk.green('SUCCESS connecting to ' + uristring));
  }
});
