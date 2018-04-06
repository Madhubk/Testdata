(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryController", InventoryController);

    InventoryController.$inject = ["$location", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "inventoryConfig", "$timeout", "toastr", "appConfig"];

    function InventoryController($location, $injector, APP_CONSTANT, authService, apiService, helperService, inventoryConfig, $timeout, toastr, appConfig) {

        var InventoryCtrl = this;

        function Init() {

            InventoryCtrl.ePage = {
                "Title": "",
                "Prefix": "Inventory",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inventoryConfig.Entities
            };
            InventoryCtrl.ePage.Masters.taskName = "WarehouseInventory";
            InventoryCtrl.ePage.Masters.dataentryName = "WarehouseInventory";
            InventoryCtrl.ePage.Masters.IsActiveDetail = true;

            InventoryCtrl.ePage.Masters.TabList = [];
            InventoryCtrl.ePage.Masters.activeTabIndex = 0;
            InventoryCtrl.ePage.Masters.InventorySummaryDetails = [];

            InventoryCtrl.ePage.Masters.IsNewInventoryClicked = false;
            InventoryCtrl.ePage.Masters.IsTabClick = false;
            InventoryCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            InventoryCtrl.ePage.Masters.AddTab = AddTab;
            InventoryCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            InventoryCtrl.ePage.Masters.RemoveTab = RemoveTab;
            InventoryCtrl.ePage.Masters.InventorySummary = InventorySummary;

        }


        function InventorySummary(value) {
            InventoryCtrl.ePage.Masters.dataentryName = undefined;

            $timeout(function () {
                if (value == "Details") {
                    InventoryCtrl.ePage.Masters.IsActiveDetail = true;
                    InventoryCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCtrl.ePage.Masters.dataentryName = "WarehouseInventory";
                } else if (value == "Product") {
                    InventoryCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCtrl.ePage.Masters.IsActiveProduct = true;
                    InventoryCtrl.ePage.Masters.dataentryName = "InventoryByProduct";
                } else if (value == "Attribute") {
                    InventoryCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCtrl.ePage.Masters.IsActiveAttribute = true;
                    InventoryCtrl.ePage.Masters.dataentryName = "InventoryByAttribute";
                } else if (value == "Location") {
                    InventoryCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCtrl.ePage.Masters.IsActiveLocation = true;
                    InventoryCtrl.ePage.Masters.dataentryName = "InventoryByLocation";
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                InventoryCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentInventory, isNew) {
            InventoryCtrl.ePage.Masters.currentInventory = undefined;

            var _isExist = InventoryCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentInventory.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                InventoryCtrl.ePage.Masters.IsTabClick = true;
                var _currentInventory = undefined;
                if (!isNew) {
                    _currentInventory = currentInventory.entity;
                } else {
                    _currentInventory = currentInventory;
                }

                inventoryConfig.GetTabDetails(_currentInventory, isNew, InventoryCtrl.ePage.Masters.dataentryName).then(function (response) {
                    InventoryCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {

                        InventoryCtrl.ePage.Masters.activeTabIndex = InventoryCtrl.ePage.Masters.TabList.length;
                        InventoryCtrl.ePage.Masters.CurrentActiveTab(currentInventory.entity.PK);
                        InventoryCtrl.ePage.Masters.IsTabClick = false;
                    })
                })
            } else {
                toastr.info('Inventory already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            InventoryCtrl.ePage.Masters.currentInventory = currentTab;
        }

        function RemoveTab(event, index, currentInventory) {
            event.preventDefault();
            event.stopPropagation();
            var currentInventory = currentInventory[currentInventory.label].ePage.Entities;
            InventoryCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        Init();
    }

})();	