angular.module('digitalturk')
  .directive('dtSortIcon', function() {
    return {
      restrict: 'EA',
      scope: {
        key: '@'
      },
      link: function(scope, elem, attrs) {
        scope.sort = function() { 
          return scope.$parent.getSort(attrs.key);
        };
        scope.sortClicked = function(e) {
          scope.$parent.sortClicked(attrs.key, e);
        }
      },
      templateUrl: 'public/directives/dtSortIcon.html'
    }
  });