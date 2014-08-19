'use strict';
// search controller

var searchController = {};

var HitGroupModel = require('../models/HitGroupModel.js');

searchController.getHits = function(req, res) {
  HitGroupModel.find({})
    .sort('-hitsAvailable')
    // VIRTUAL NOT POPULATING RATE AVG
    .populate('requester', 'requesterId name rate_fair rate_pay rate_comm rate_fast rate_avg')
    .exec(function(err, hitGroups) {
      if (err) {
        res.json({
          success: false,
          err: err
        });
      } else {
        res.json({
          success: true,
          data: hitGroups
        });
      }
    });
};

module.exports = searchController;