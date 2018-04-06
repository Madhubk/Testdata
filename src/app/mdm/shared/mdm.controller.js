(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MdmController", MdmController);

    MdmController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService"];

    function MdmController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService) {
        /* jshint validthis: true */
        var MdmCtrl = this;

        function Init() {}

        Init();
    }
})();
