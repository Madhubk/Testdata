(function () {
    "use strict";

    angular
        .module("Application")
        .factory("apiInterceptors", ApiInterceptors);

    ApiInterceptors.$inject = ['$rootScope'];

    function ApiInterceptors($rootScope) {
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
