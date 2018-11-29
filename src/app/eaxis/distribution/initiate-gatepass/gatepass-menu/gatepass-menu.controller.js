(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassMenuController", GatepassMenuController);

    GatepassMenuController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "$timeout"];

    function GatepassMenuController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, $timeout) {

        var GatepassMenuCtrl = this;

        function Init() {
            var currentGatepass = GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities;
            GatepassMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

        }

        Init();
    }

})();