(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryMenuController", InventoryMenuController);

    InventoryMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inventoryConfig", "helperService", "appConfig"];

    function InventoryMenuController($scope, $timeout, APP_CONSTANT, apiService, inventoryConfig, helperService, appConfig) {

        var InventoryMenuCtrl = this;

        function Init() {

            var currentInventory = InventoryMenuCtrl.currentInventory[InventoryMenuCtrl.currentInventory.label].ePage.Entities;

            InventoryMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Inventory_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInventory

            };

            InventoryMenuCtrl.ePage.Masters.Inventory = {};
        }
        Init();

    }

})();