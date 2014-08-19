angular.module('digitalturk')
  .directive('dtSliders', ['$modal', 'dtSearchService', function($modal, SearchService) {
    return {
      restrict: 'EA',
      scope: {
        customData: '&'
      },
      link: function(scope, elem, attrs) {
        scope.sliderModal = function() {
          $modal.open({
            templateUrl: 'public/directives/dtSlidersModal-' + attrs.template + '.html',
            controller: 'SliderModalController',
            resolve: {
              SearchService: function() { return SearchService; },
              customData: function() {
                return attrs.customData ? scope.customData() : {};
              }
            }
          });
        }
      },
      templateUrl: 'public/directives/dtSliders.html'
    }
  }]);

angular.module('digitalturk')
  .controller('SliderModalController', function($scope, $modalInstance, SearchService, customData) {
    $scope.customData = customData;
    console.log($scope.customData);

    $scope.filters = {};

    $scope.closeModalNoSave = function() {
      $modalInstance.close();
    }

    $scope.closeModalAndSave = function() {
      $modalInstance.close();
      for (var filter in $scope.filters) {
        SearchService.filters[filter] = {
          val: {
            min: $scope.filters[filter].rangeValues[0],
            max: $scope.filters[filter].rangeValues[1]
          },
          sliderValues: {
            min: $scope.filters[filter].sliderValues[0],
            max: $scope.filters[filter].sliderValues[1]
          },
          keys: filter.split('.')
        };
      }
    }

    $scope.filters = {};
  });

angular.module('digitalturk')
  .directive('dtSlider', ['dtSearchService', '$timeout', function(SearchService, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        label: '@'
      },
      link: function(scope, elem, attrs) {
        var valueRange = scope.$eval(attrs.range);
        scope.prefix = attrs.prefix ? attrs.prefix : '';

        function defaultValues() {
          // var fullRange = scope.$eval(attrs.range);
          // return [fullRange[0], fullRange[fullRange.length - 1]];
          return [0,1];
        }

        scope.nDigits = attrs.nDigits ? Number(attrs.nDigits) : 2;

        if (SearchService.filters[attrs.key]) {
          var start = [
            Number(SearchService.filters[attrs.key].sliderValues.min),
            Number(SearchService.filters[attrs.key].sliderValues.max)
          ];
        } else {
          var start = defaultValues();
        }

        var range = {
          min: 0,
          max: 1
        };

        // for (var i = 1; i < fullRange.length - 1; i++) {
        //   range[Math.round(i * 100/(fullRange.length - 1)) + '%'] = [fullRange[i]];
        // }
        // console.log(range); 

        // if (attrs.log) {
        //   // noui slider does not have a built in log function but we can simulate it
        //   // using 10 break points
        //   for (var i = 1; i <= 9; i++) {
        //     var totRange = range.max - range.min;
        //     // function(i) { return max * (Math.exp(i) - 1)/(Math.exp(1) - 1) })
        //     range[(i * 10) + '%'] = range.min + totRange * (Math.exp(i/10) - 1)/(Math.exp(1) - 1);
        //   }
        //   console.log(range);
        // }

        var slider = elem.find('.slider');
        slider.noUiSlider({
          range: range,
          start: start
        }).on('slide', updateParent)
        .on('change', function() {
          $timeout(function() {});
        });

        scope.val = function() {
        // val = function() {
          var curVals = slider.val();
          // curVals = [0,0.1,0.2,0.3,0.4,0.5, 0.6,0.7,0.8,0.9,1];
          // valueRange = [0,5,20];

          var unitSize = 1/(valueRange.length - 1);

          for (var i = 0; i < curVals.length; i++) {
            var cv = curVals[i];
            
            var index = Math.floor(cv * (valueRange.length - 1));
            if (index === valueRange.length - 1) {
              curVals[i] = valueRange[valueRange.length - 1];
            } else {

              // interpolate cv from valueRange[index] to valueRange[index + 1]

              curVals[i] = Math.round((valueRange[index] + (valueRange[index+1] - valueRange[index]) * (cv % unitSize)/unitSize)*Math.pow(10,scope.nDigits))/Math.pow(10,scope.nDigits);
            }
          }
          return curVals;
        };
        // val();
        scope.resetValues = function() {
          slider.val(defaultValues());
          updateParent();
        }

        function updateParent() {
          scope.$parent.filters[attrs.key] = {};
          scope.$parent.filters[attrs.key].rangeValues = scope.val();
          scope.$parent.filters[attrs.key].sliderValues = slider.val();

        }

        setTimeout(updateParent);
      },
      templateUrl: 'public/directives/dtSlider.html'
    }
  }]);