angular.module('digitalturk')
  .filter('dtAverageRating', function() {
    return function(input) {
      var numerator = 0;
      var denominator = 0;
      ['rate_fair', 'rate_pay', 'rate_fast','rate_comm'].forEach(function(val) {
        var num = Number(input.requester[val]);
        if (!isNaN(num)) {
          numerator += num;
          denominator++;
        }
      });
      var quotient = numerator/denominator;

      if (isNaN(quotient)) {
        return '';
      } else {
        return quotient;
      }
    }
  });