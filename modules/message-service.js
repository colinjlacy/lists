angular.module("boomLists")
    .factory("messages", function($rootScope) {
       return {
           display: function(string, type) {
               if (!$rootScope.message) {
                   $rootScope.message = {};
               }
               $rootScope.message.string = string;
               $rootScope.message.type = type;
               $rootScope.message.display = true;
               var messageContainer = $('#message-container');
               messageContainer.removeClass('animated fadeOut').removeAttr('style');
               setTimeout(function() {
                   messageContainer.addClass('animated fadeOut');
                   setTimeout(function () {
                       messageContainer.slideUp(400);
                   }, 1000)
               }, 1500);
           },
           remove: function() {
               $('#message-container').addClass('invisible').slideUp(400);
           }
       }
    });
