(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryMenuCustController", InventoryMenuCustController);

    InventoryMenuCustController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inventoryConfig", "helperService", "appConfig"];

    function InventoryMenuCustController($scope, $timeout, APP_CONSTANT, apiService, inventoryConfig, helperService, appConfig) {

        var InventoryMenuCustCtrl = this;

        function Init() {

            var currentInventory = InventoryMenuCustCtrl.currentInventory[InventoryMenuCustCtrl.currentInventory.label].ePage.Entities;

            InventoryMenuCustCtrl.ePage = {
                "Title": "",
                "Prefix": "Inventory_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInventory

            };

            InventoryMenuCustCtrl.ePage.Masters.Inventory = {};
        }
        Init();

    }

})();