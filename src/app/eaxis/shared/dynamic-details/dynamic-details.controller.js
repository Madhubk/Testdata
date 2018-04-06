(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDetailsController", DynamicDetailsController);

    DynamicDetailsController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService"];

    function DynamicDetailsController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService) {
        /* jshint validthis: true */
        var DynamicDetailsCtrl = this;

        function Init() {
            DynamicDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicDetails",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
