var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  turkopticon = require('../services/turkopticon.js'),
  chalk = require('chalk');

// connect to mongo if it hasn't happened already
require('../services/mongoose.js')

var RequesterSchema = new Schema(
  {
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    
    // mturk
    requesterId: { type: String, required: true, index: { unique: true }},
    name: { type: String },
    
    // turkopticon
    rate_fair: { type: Number },
    rate_pay: { type: Number },
    rate_comm: { type: Number },
    rate_fast: { type: Number },
    // rate_TOSViolations: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);


RequesterSchema.virtual('rate_avg').get(function() {
  var numerator = 0;
  var denominator = 0;
  var me = this;
  ['rate_fair', 'rate_pay', 'rate_fast','rate_comm'].forEach(function(val) {
    var num = Number(me[val]);
    if (!isNaN(num)) {
      numerator += num;
      denominator++;
    }
  });
  var quotient = numerator/denominator;

  if (isNaN(quotient)) {
    return undefined;
  } else {
    return Math.round(quotient * 100) / 100;
  }
});

RequesterSchema.statics.massUpdate = function(requesters) {
  for (var i = 0; i < requesters.length; i++) (function(i) {
    Requester.findOne({
      requesterId: requesters[i].requesterId
    }, function(err, doc) {
      if (err) {
        console.log(chalk.red('Error finding requester'));
        console.log(err);
      } else if (doc) {
        console.log(chalk.cyan('found requester ' + requesters[i].name))
        for (var val in requesters[i]) {
          if (requesters[i].hasOwnProperty(val)) {
            doc[val] = requesters[i][val];
          }
        }
        doc.save(function(err, docSaved) {
          if (err) {
            console.log(chalk.red('Error saving modified doc'));
            console.log(err);
            console.log(doc);
          }
        });
      } else {
        console.log(chalk.cyan('not found requester ' + requesters[i].name));

        newRequester = new Requester(requesters[i]);
        console.log('pre save')
        console.log(newRequester);
        newRequester.save(function(err, docSaved) {
          console.log('post save');
          console.log(docSaved);
          if (err) {
            console.log(chalk.red('Error saving modified doc'));
            console.log(err);  
          }
        })
      }
    });
  })(i)
}

// update info from turkopticon:
RequesterSchema.methods.updateRatings = function(ratings, cb) {
  var me = this;

  ['rate_fair', 'rate_pay', 'rate_comm', 'rate_fast','numberOfRatings', 'rate_TOSViolations']
    .forEach(function(value, key) {
      me[key] = value;
    });

  me.lastRatingUpdate = new Date(Date.now());

  me.save(function(err, requester) {
    if (err) {
      cb(err);
    } else {
      cb(null, requester);
    }
  });
};

RequesterSchema.statics.createStub = function(id, cb) {
  var requester = new Requester({
    requesterId: id,
    name: ''
  });

  requester.save(function(err, doc) {
    cb(err, doc);
  });
};

// queries turkopticon
RequesterSchema.statics.createFromId = function(id, cb) {
  turkopticon.getById(id, function(err, requester) {
    if (err) {
      Requester.createStub(id, cb);
    } else {
      if (requester) {
        req2 = new Requester(requester);
        req2.save(function(err, doc) {
          // we sometimes get race conditions as you attempt to save two
          // models at once with the same key
          if (err && err.code === 11000) {
            console.log('dup key race condition - ' + req2.name);
            Requester.findOne({
              requesterId: id
            }, function(err, doc) {
              cb(err, doc);
            });
          } else {
            cb(err, doc);
          }

        });
      } else {
        Requester.createStub(id, cb);
      }
    }
  })
};

var Requester = module.exports = mongoose.model('Requester', RequesterSchema);