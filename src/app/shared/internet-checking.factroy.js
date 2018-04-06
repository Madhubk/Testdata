(function () {
    "use strict";

    angular
        .module("Application")
        .factory("apiInterceptors", ApiInterceptors);

    ApiInterceptors.$inject = ['$q', '$injector', '$timeout', '$rootScope'];

    function ApiInterceptors($q, $injector, $timeout, $rootScope) {
        $rootScope.apiHitReceivedTime;

        var apiInterceptorsCheck = {
            response: function (config) {
                var countdown = function () {
                    $rootScope.apiHitReceivedTime = new Date();
                };
                countdown();
                return config;
            }
        };

        return apiInterceptorsCheck;
    }
})();
