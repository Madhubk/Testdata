(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockoutVehicleController", DockoutVehicleController);

    DockoutVehicleController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function DockoutVehicleController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var DockoutVehicleCtrl = this;

        function Init() {

            var currentManifest = DockoutVehicleCtrl.currentManifest[DockoutVehicleCtrl.currentManifest.label].ePage.Entities;

            DockoutVehicleCtrl.ePage = {
                "Title": "",
                "Prefix": "Dockout_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            DockoutVehicleCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DockoutVehicleCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DockoutVehicleCtrl.jobfk })

            if (DockoutVehicleCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DockoutVehicleCtrl.ePage.Masters.MenuList = DockoutVehicleCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DockoutVehicleCtrl.ePage.Masters.MenuList = DockoutVehicleCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            DockoutVehicleCtrl.ePage.Masters.Empty = "-";
            DockoutVehicleCtrl.ePage.Masters.Config = dmsManifestConfig;

        }

        Init();
    }

})();