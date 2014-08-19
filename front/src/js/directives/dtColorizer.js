angular.module('digitalturk')
  .directive('dtColorizer', [function() {
    return {
      restrict: 'EA',
      scope: {
        value: '@'
      },
      link: function(scope, elem, attrs) {
        scope.value = Number(scope.$parent.$eval(attrs.value));

        var colorScale = ["#dd3300", "#f08424", "#fbb94e", "#ffe27a", "#ffffaa", "#e8f182", "#c7df60", "#9cc745", "#66aa33"];

        var min = 1, max = 5, width = (max - min)/(colorScale.length - 1);
        elem.attr('style', 'background-color: ' + colorScale[Math.round((scope.value - min)/width)]);
      }
    };
  }]);