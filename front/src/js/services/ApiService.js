angular.module('digitalturk')
  .service('dtApiService', ['$http', function($http) {
    var ApiService = {};

    ApiService.getData = function(options, cb) {
      $http({
        method: 'GET',
        url: '/search'
      })
      .success(function(data, status, headers, config) {
        cb(null, data);
      })
      .error(function(data, status, headers, config) {
        cb(new Error('Api Service Error'))
      });
    }

    return ApiService;
  }]);