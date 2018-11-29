(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockinVehicleController", DockinVehicleController);

    DockinVehicleController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function DockinVehicleController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var DockinVehicleCtrl = this;

        function Init() {

            var currentManifest = DockinVehicleCtrl.currentManifest[DockinVehicleCtrl.currentManifest.label].ePage.Entities;

            DockinVehicleCtrl.ePage = {
                "Title": "",
                "Prefix": "Dockin_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            DockinVehicleCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DockinVehicleCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DockinVehicleCtrl.jobfk })

            if (DockinVehicleCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DockinVehicleCtrl.ePage.Masters.MenuList = DockinVehicleCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DockinVehicleCtrl.ePage.Masters.MenuList = DockinVehicleCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            DockinVehicleCtrl.ePage.Masters.Empty = "-";
            DockinVehicleCtrl.ePage.Masters.Config = dmsManifestConfig;

        }

        Init();
    }

})();