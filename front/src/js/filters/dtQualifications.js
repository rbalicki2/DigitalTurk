angular.module('digitalturk')
  .filter('dtQualifications', function() {
    return function(input) {
      var str = '';
      for (var i = 0; i < input.length; i++) {
        str += input[i].qual + ' ' + input[i].comparisonString + 
          (input[i].value !== null ?
            input[i].comparisonString === 'has been granted' ? '' : ' ' + input[i]['value'] :
            '')
          + ', ';
      }
      return str.substring(0, str.length - 2);
      // return str;
    }
  });