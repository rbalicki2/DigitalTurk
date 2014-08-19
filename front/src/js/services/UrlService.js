angular.module('digitalturk')
  .service('dtUrlService', [function() {
    var UrlService = {};

    UrlService.previewHit = function(hitId) {
      return 'https://www.mturk.com/mturk/preview?groupId=' + hitId;
    };

    UrlService.searchForHit = function(hitName, requesterName) {
      return 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + hitName + ' ' + requesterName;
    };

    UrlService.mturkRequesterLookup = function(requesterId) {
      return 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + requesterId;
    };

    UrlService.turkoRequesterLookup = function(requesterId) {
      return 'http://turkopticon.ucsd.edu/reports?id=' + requesterId;
    }

    return UrlService;
  }]);