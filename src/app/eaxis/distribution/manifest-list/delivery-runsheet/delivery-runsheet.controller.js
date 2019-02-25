(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryRunsheetController", DeliveryRunsheetController);

    DeliveryRunsheetController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http","$filter"];

    function DeliveryRunsheetController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http,$filter) {

        var DeliveryRunsheetCtrl = this;

        function Init() {

            var currentManifest = DeliveryRunsheetCtrl.currentManifest[DeliveryRunsheetCtrl.currentManifest.label].ePage.Entities;

            DeliveryRunsheetCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery Runsheet",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            
            DeliveryRunsheetCtrl.ePage.Masters.DropDownMasterList = {};

            DeliveryRunsheetCtrl.ePage.Entities.Header.Data.jobfk = $filter('filter')(DeliveryRunsheetCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DeliveryRunsheetCtrl.jobfk })

            if (DeliveryRunsheetCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DeliveryRunsheetCtrl.ePage.Masters.MenuList = DeliveryRunsheetCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DeliveryRunsheetCtrl.ePage.Masters.MenuList = DeliveryRunsheetCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            DeliveryRunsheetCtrl.ePage.Masters.Empty = "-";
            DeliveryRunsheetCtrl.ePage.Masters.Config = dmsManifestConfig;
        }
        
        Init();
    }

})();