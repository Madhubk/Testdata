(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DashboardController", DashboardController);

    DashboardController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr"];

    function DashboardController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr) {

        var DashboardCtrl = this;

        function Init() {

            DashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
        }
        Init();
    }
})();