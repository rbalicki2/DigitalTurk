// Module for querying turkopticon

var request = require('request');

var turkopticon = {};

// http://api.turkopticon-devel.differenceengines.com/multi-attrs.php?ids=A3RRY7BIF8JDCS,A2VZU2Q1H3Y2KA,A3C7UKE00I9MKL,A198USUSWOB9C7,A13YV2LD0WTS7K,A3H3EZNM8ORYNI,A3F5UZADAOZUUG

turkopticon.getById = function(id, cb) {
  var req = request('http://api.turkopticon-devel.differenceengines.com/multi-attrs.php?ids=' + id, function(err, res, body) {
    var resp = JSON.parse(body)[id];

    typeof resp == 'string' ? resp = {} : null;
    resp.attrs = resp.attrs || {};

    var requester = {
      requesterId: id,
      name: resp.name,
      rate_fair: resp.attrs.fair === 0 ? undefined : resp.attrs.fair,
      rate_pay: resp.attrs.pay === 0 ? undefined : resp.attrs.pay,
      rate_comm: resp.attrs.comm === 0 ? undefined : resp.attrs.comm,
      rate_fast: resp.attrs.fast === 0 ? undefined : resp.attrs.fast,
      numberOfRatings: resp.reviews,
      // rate_TOSViolations: resp.tos_flags
    };

    cb(null, requester);
  });
}

module.exports = turkopticon;