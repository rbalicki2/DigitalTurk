angular.module('digitalturk')
  .filter('dtJuration', function() {
    return function(input) {
      return juration.stringify(Number(input));
    }
  });