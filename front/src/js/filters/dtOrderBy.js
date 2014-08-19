angular.module('digitalturk')
  .filter('dtOrderBy', function() {
    return function(array, sortPredicate) {
      var arrayCopy = [];
      if (!array) { return []; }
      for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
      return arrayCopy.sort(comparator);

      function comparator(o1, o2) {
        for ( var i = 0; i < sortPredicate.length; i++) {
          if (sortPredicate[i].charAt(0) === '-') {
            var sort = sortPredicate[i].substring(1);
            var reverse = -1;
          } else {
            var reverse = 1;
            var sort = sortPredicate[i];
          }

          var comp = compare(get(o1,sort), get(o2,sort)) * reverse;
          if (comp !== 0) return comp;
        }
        return 0;
      }

      function get(obj, sort) {
        var sorts = sort.split('.');

        var toReturn = obj;
        for (var i = 0; i < sorts.length; i++) {
          toReturn = toReturn[sorts[i]];
        }
        return toReturn;
      }

      function compare(v1, v2) {
        var t1 = typeof v1;
        var t2 = typeof v2;

        if (v1 === undefined && v2 !== undefined) return -1;
        if (v1 !== undefined && v2 === undefined) return 1;

        if (t1 == t2) {
          if (v1 instanceof Date && v2 instanceof Date) {
            v1 = v1.valueOf();
            v2 = v2.valueOf();
          }
          if (t1 == "string") {
             v1 = v1.toLowerCase();
             v2 = v2.toLowerCase();
          }
          if (v1 === v2) return 0;
          return v1 < v2 ? -1 : 1;
        } else {
          return t1 < t2 ? -1 : 1;
        }
      }
    }
  });