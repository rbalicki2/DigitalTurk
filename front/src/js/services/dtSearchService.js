angular.module('digitalturk')
  .service('dtSearchService', ['dtApiService', 'localStorageService', function(ApiService, localStorageService) {
    var SearchService = {};

    SearchService.showStarred = false;
    SearchService.starred = localStorageService.get('starredIds');
    SearchService.starred = SearchService.starred || [];
    SearchService.isStarred = function(hitgroupId) {
      return SearchService.starred.indexOf(hitgroupId) !== -1;
    };
    SearchService.toggleStar = function(hitgroupId) {
      if (SearchService.isStarred(hitgroupId)) {
        SearchService.starred.splice(SearchService.starred.indexOf(hitgroupId), 1);
      } else {
        SearchService.starred.push(hitgroupId);
      }

      localStorageService.set('starredIds', SearchService.starred);
    };

    SearchService.toggleSortStarred = function() {
      console.log(SearchService.showStarred);
      SearchService.showStarred = !SearchService.showStarred;            
    };


    ApiService.getData({
    }, function(err, data) {
      SearchService.hitgroups = data.data;
    });

    SearchService.filterFunction = function(element) {
      if (SearchService.showStarred && !SearchService.isStarred(element.hitGroupId)) {
        return false;
      }
      for (var key in SearchService.filters) {

        var filter = SearchService.filters[key]
        var elem = element;
        for (var i = 0; i < filter.keys.length; i++) {
          elem = elem[filter.keys[i]];
        }

        if (elem > Number(filter.val.max) || elem < Number(filter.val.min)) return false;
      }

      return true;
    };

    SearchService.clearFilters = function() {
      SearchService.filters = {};
      SearchService.quickSearch = '';
    };

    // initial empty filters, quick search
    SearchService.clearFilters();
    
    return SearchService;
  }]);