angular.module('digitalturk')
  .directive('dtLimit', function() {
    return {
      restrict: 'EA',
      scope: {
      },
      link: function(scope, elem, attr) {
        scope.message = scope.$parent.$eval(attr.message);
        scope.limit = scope.$eval(attr.limit);
        
        // include up to limit characters; also cut off any partial words at the end
        // of short message
        if (scope.message) {
          scope.shortMessage = scope.message.substring(0,scope.limit).replace(/\s+\S*$/,'');
        } else {
          scope.message = '';
          scope.shortMessage = '';
        }
        
        scope.messageObscured = scope.message.length > scope.limit;

        var shortMessage = elem.find('.short-message');
        var shortMessageContainer = elem.find('.short-message-container');
        var fullMessage = elem.find('.full-message');

        shortMessage.text(scope.shortMessage + ' ');
        fullMessage.text(scope.message);
        elem.find('a').click(function() {
          shortMessageContainer.hide();
          fullMessage.show();
        });
      },
      templateUrl: 'public/directives/dtLimit.html'
    }
  })