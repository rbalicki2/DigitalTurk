angular.module('digitalturk')
  .directive('dtHitgroupTable', ['dtSearchService', 'dtUrlService', 'localStorageService', function(SearchService, UrlService, localStorageService) {
    return {
      restrict: 'EA',
      templateUrl: 'public/directives/dtHitgroupTable.html',
      scope: {
      },
      link: function(scope, elem, attrs) {

        scope.UrlService = UrlService;

        scope.SearchService = SearchService;

        scope.nColumns = {
          requester: function() {
            return 2 + 4 * !scope.show.condensedRatings;
          },
          hitgroup: function() {
            return 4 + scope.show.expirationDate;
          },
          details: function() {
            return 3;
          }
        };

        scope.expandedRatings = {
          show: function() {
            elem.find('.condensed-rating').hide();
            elem.find('.expanded-rating').show();
            scope.show.condensedRatings = false;
            elem.find('.initial-hide').removeClass('initial-hide');
          },
          hide: function() {
            elem.find('.condensed-rating').show();
            elem.find('.expanded-rating').hide();
            scope.show.condensedRatings = true;
            elem.find('.initial-hide').removeClass('initial-hide');
            
          }
        };


        window.expandedRatings = scope.expandedRatings;

        setTimeout(function() {
          // elem does not exist during link
          elem.find('.initial-hide').removeClass('initial-hide');
          scope.expandedRatings.hide();
        });

        scope.max = function(key) {
          var max = 0;
          for (var i = 0; i < scope.hitgroups.length; i++) {
            if (scope.hitgroups[i][key] > max) max = scope.hitgroups[i][key];
          } 
          return max;
        };

        scope.show = {
          condensedRatings: true,
          expirationDate: false
        };

        function defaultSortArray() {
          return ['-hitsAvailable'];
        }

        scope.sortArray = defaultSortArray();

        scope.getSort = function(key) {
          if (scope.sortArray.indexOf(key) !== -1) return 1;
          else if (scope.sortArray.indexOf('-' + key) !== -1) return -1;
          else return 0;
        }

        scope.sortClicked = function(key, event) {
          var ascIndex = scope.sortArray.indexOf(key);
          var descIndex = scope.sortArray.indexOf('-' + key);
          var index = Math.max(ascIndex, descIndex);
          var shiftPressed = event.shiftKey;
          var altPressed = event.altKey;


          // if we did not press shift, sort by only the key, either
          // ascending or descending
          // => you must press shift to clear the search
          if (!shiftPressed) {
            if (descIndex !== -1) {
              scope.sortArray = [key];
            } else {
              scope.sortArray = ['-' + key];
            }
            return;
          }

          // shift removes the element if its the only one sorted
          if (scope.sortArray.length === 1) {
            scope.sortArray = defaultSortArray();
            return;
          }

          // if its not the only one, you need to click w/shift twice to remove it
          if (index === -1) {
            // shift pressed, append to array if its not there
            scope.sortArray.push('-' + key);
          } else if (descIndex !== -1) {
            // reverse if its descending
            scope.sortArray[index] = key;
          } else {
            // remove if its ascending
            scope.sortArray.splice(index, 1);
          }
        };


      }
    };
  }]);