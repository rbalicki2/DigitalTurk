angular.module('digitalturk')
  .filter('dtKeywords', function() {
    return function(input) {
      return input.join(', ');
    }
  });