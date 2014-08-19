// Hit group

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Requester = require('./RequesterModel.js'),
  chalk = require('chalk'),
  async = require('async');

// connect to mongo if it hasn't happened already
require('../services/mongoose.js')

var HitGroupSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, required: true, ref: 'Requester' },
  updated: { type: Date, default: Date.now },

  // general
  hitGroupId: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  keywords: [{type: String}],
  hitsAvailable: { type: Number, required: true },
  
  // task and money
  expirationDate: { type: Date, required: true },
  timeAllotted: { type: Number, required: true }, // seconds
  reward: { type: Number, required: true }, // dollars

  // qualifications
  qualifications: { type: Array, default: [] }
});

function updateHitGroup(hitGroupData, requester, cb) {
  console.log('update hit group')
  // console.log(hitGroupData);
  HitGroup.findOne({
    requester: requester.id,
    name: hitGroupData.name
  }, function(err, doc) {
    if (err) {
      console.log(chalk.red('Error finding HitGroup in updateHitGroup'));
      console.log(err);
      cb(err);
    } else {
      if (doc) {
        for (var key in hitGroupData) {
          if (hitGroupData.hasOwnProperty(key)) {
            doc[key] = hitGroupData[key];
          }
        }
        doc.save(function(err, doc) {
          if (err) {
            console.log(chalk.red('Error saving updated HitGroup in updateHitGroup'));
            console.log(err);
          } else {
            console.log(chalk.green('Successfully updated and saved hit group "' + doc.name + '"'));
          }
          cb(err, doc);
        });
      } else {
        hitGroupData.requester = requester.id;
        var hitGroup = new HitGroup(hitGroupData);
        hitGroup.save(cb);
      }
    }
  })
}

HitGroupSchema.statics.createHitGroup = function(hitGroupData, requester, cb) {
  hitGroupData.requester = requester.id;

  var hitgroup = new HitGroup(hitGroupData);

  hitgroup.save(cb);
}

HitGroupSchema.statics.createOrUpdate = function(hitGroupData, cb) {
  cb = cb || function(err) {
    if (err) {
      console.log(chalk.red('error creating or updating'))
      console.log(err)
    }
  };

  Requester.findOne({
    requesterId: hitGroupData.requesterId
  }, function(err, requester) {
    if (err) {
      console.log(chalk.red('ERRORRRR trying to find requester'))
      console.log(err);
      cb(err);
    } else {
      if (requester) {
        console.log('found requester');
        updateHitGroup(hitGroupData, requester, cb); 
      } else {
        Requester.createFromId(hitGroupData.requesterId, function(err, requester) {
          console.log('made requester'); 
          updateHitGroup(hitGroupData, requester, cb);  
        });
      }
    }
  });
}

HitGroupSchema.statics.massUpdate = function(hitgroups, cb) {
  cb = cb || function() {};
  console.log(chalk.cyan('mass update'))
  // // HitGroup.find({}, function(err, doc) {
  //   console.log('find all ...?')
  //   console.log(doc.length);
  // });

  HitGroup.find({}).remove(function(err) {
    // console.log(chalk.cyan('removed all'))
    // console.log(err);
    var tasks = [];
    for (var i = 0; i < hitgroups.length; i++) (function(i) {
      // console.log(chalk.cyan('processing ' + i))
      // console.log(hitgroups[i]);
      tasks.push(function(cb) {
        // console.log(chalk.cyan('task ' + i))
        Requester.findOne({
          requesterId: hitgroups[i].requesterId
        }, function(err, requester) {
          if (err) {
            console.log(chalk.red('ERRORRRR trying to find requester'))
            console.log(err);
            cb(err);
          } else {
            if (requester) {
              HitGroup.createHitGroup(hitgroups[i], requester, cb); 
            } else {
              Requester.createFromId(hitgroups[i].requesterId, function(err, requester) {
                HitGroup.createHitGroup(hitgroups[i], requester, cb);  
              });
            }
          }
        });
      });
    })(i);

    async.parallel(tasks, function(err, results) {
      // console.log('success?')
      cb(err, results);
    });
  });
};

var HitGroup = module.exports = mongoose.model('HitGroup', HitGroupSchema);

  