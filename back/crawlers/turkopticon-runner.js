'use strict';
var chalk = require('chalk'),
    Requester = require('../models/RequesterModel'),
    Crawler = require('crawler').Crawler,
    turkProcessor = require('./turkopticon-processor'),
    async = require('async');

function turkopticonUrl(pageNumber) {
  return 'http://turkopticon.ucsd.edu/requesters?order=updated_at+DESC&page=' + pageNumber;
}

var c = new Crawler({
  'maxConnections' : 5
});

function crawlerLoop(cb) {
  console.log(chalk.cyan('Beginning turkopticon crawler loop.'));

  cb = cb || function() {};

  var turkopts = [];
  var task = 0;
  var tasksToComplete;

  function queuePage() {
    c.queue([{
      url: turkopticonUrl(task+1),
      callback: function(err, result, $) {
        task++;

        tasksToComplete = turkProcessor.getNumberOfPages(result, $);

        // console.log(turkProcessor.getRequesterData(result, $));
        Requester.massUpdate(turkProcessor.getRequesterData(result, $));

        if (task >= tasksToComplete) {
          task = 0;

          cb();

          // crawl once per hour
          setTimeout(crawlerLoop, 1000*60*60);
        } else {
          setTimeout(queuePage, 500);
        }
      }
    }]);
  }

  queuePage();
}

// crawlerLoop();

module.exports = function(launchMTurk) {
  crawlerLoop(function() {
    if (launchMTurk) {
      require('./mturk-runner.js');
    }
  });
}

if (require.main === module) {
  // crawlerLoop(true);
  module.exports(true);
}