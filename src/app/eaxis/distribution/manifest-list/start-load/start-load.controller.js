(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartLoadController", StartLoadController);

    StartLoadController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function StartLoadController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var StartLoadCtrl = this;

        function Init() {

            var currentManifest = StartLoadCtrl.currentManifest[StartLoadCtrl.currentManifest.label].ePage.Entities;

            StartLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Start_Load",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            StartLoadCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(StartLoadCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: StartLoadCtrl.jobfk })

            if (StartLoadCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                StartLoadCtrl.ePage.Masters.MenuList = StartLoadCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                StartLoadCtrl.ePage.Masters.MenuList = StartLoadCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            StartLoadCtrl.ePage.Masters.Empty = "-";
            StartLoadCtrl.ePage.Masters.Config = dmsManifestConfig;
        }

        Init();
    }

})();