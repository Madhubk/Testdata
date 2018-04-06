(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MdmDashboardController", MdmDashboardController);

    MdmDashboardController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService"];

    function MdmDashboardController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService) {
        /* jshint validthis: true */
        var MdmDashboardCtrl = this;

        function Init() {}

        Init();
    }
})();
