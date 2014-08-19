angular.module('digitalturk', ['ngRoute', 'ui.bootstrap', 'pasvaz.bindonce','LocalStorageModule'],
  function configModule($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/public/views/main.html',
      controller: 'dtMainCtrl'
    });
  });
