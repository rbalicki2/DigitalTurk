'use strict';
var chalk = require('chalk'),
    HitGroup = require('../models/HitGroupModel.js'),
    Crawler = require('crawler').Crawler,
    mturkProcessor = require('./mturk-processor'),
    async = require('async');

var PAGES_TO_CRAWL = 20;

function amazonUrl(pageNumber) {
  return 'https://www.mturk.com/mturk/viewhits?searchWords=&selectedSearchType=hitgroups&sortType=NumHITs%3A1&pageNumber=' + pageNumber + '&searchSpec=HITGroupSearch%23T%231%2310%23-1%23T%23%21%23%21NumHITs%211%21%23%21';
}

var c = new Crawler({
  'maxConnections' : 5,
  'callback': function(err, result, $) {
    var eis = mturkProcessor(err, result, $);
  }
});

function crawlerLoop() {
  console.log(chalk.cyan('Beginning mturk crawler loop.'));

  var eis = [];
  var tasksComplete = 0;

  var q = async.queue(function(task, callback) {

    c.queue([{
      url: amazonUrl(task+1),
      callback: function(err, result, $) {
        var ei = mturkProcessor(err, result, $);
        console.log(chalk.cyan('MTurk Crawler: processed page ' + (task + 1) + ' - # of results: ' + ei.length));
        eis = eis.concat(ei);

        tasksComplete++;
        if (tasksComplete === PAGES_TO_CRAWL) {
          HitGroup.massUpdate(eis);
          setTimeout(crawlerLoop, 5000);
        }

        setTimeout(callback, 2000);
      }
    }]);


  }, 1);

  for (var i = 0; i < PAGES_TO_CRAWL; i++) {
    q.push(i);
  }
}

crawlerLoop();