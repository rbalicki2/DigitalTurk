angular.module('digitalturk')
  .controller('dtNavCtrl', ['$scope', 'dtSearchService', function($scope, SearchService) {
    $scope.SearchService = SearchService;
  }]);

