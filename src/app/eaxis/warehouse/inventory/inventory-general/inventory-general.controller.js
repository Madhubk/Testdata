(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryGeneralController", InventoryGeneralController);

    InventoryGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "inventoryConfig", "helperService", "toastr"];

    function InventoryGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, inventoryConfig, helperService, toastr) {

        var InventoryGeneralCtrl = this;

        function Init() {

            var currentInventory = InventoryGeneralCtrl.currentInventory[InventoryGeneralCtrl.currentInventory.label].ePage.Entities;
            console.log(currentInventory);

            InventoryGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInventory,
            }

            InventoryGeneralCtrl.ePage.Masters.emptyText = '';

        }

        Init();
    }

})();