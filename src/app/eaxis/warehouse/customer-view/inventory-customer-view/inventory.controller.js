(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryCustController", InventoryCustController);

    InventoryCustController.$inject = ["$location", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "inventoryConfig", "$timeout", "toastr", "appConfig"];

    function InventoryCustController($location, $injector, APP_CONSTANT, authService, apiService, helperService, inventoryConfig, $timeout, toastr, appConfig) {

        var InventoryCustCtrl = this;

        function Init() {

            InventoryCustCtrl.ePage = {
                "Title": "",
                "Prefix": "Inventory",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inventoryConfig.Entities
            };
            InventoryCustCtrl.ePage.Masters.taskName = "CustomerWarehouseInventory";
            InventoryCustCtrl.ePage.Masters.dataentryName = "CustomerWarehouseInventory";
            InventoryCustCtrl.ePage.Masters.IsActiveDetail = true;

            InventoryCustCtrl.ePage.Masters.TabList = [];
            inventoryConfig.TabList = [];
            InventoryCustCtrl.ePage.Masters.activeTabIndex = 0;
            InventoryCustCtrl.ePage.Masters.InventorySummaryDetails = [];

            InventoryCustCtrl.ePage.Masters.IsNewInventoryClicked = false;
            InventoryCustCtrl.ePage.Masters.IsTabClick = false;
            InventoryCustCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            InventoryCustCtrl.ePage.Masters.AddTab = AddTab;
            InventoryCustCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            InventoryCustCtrl.ePage.Masters.RemoveTab = RemoveTab;
            InventoryCustCtrl.ePage.Masters.InventorySummary = InventorySummary;

        }


        function InventorySummary(value) {
            InventoryCustCtrl.ePage.Masters.dataentryName = undefined;

            $timeout(function () {
                if (value == "Details") {
                    InventoryCustCtrl.ePage.Masters.IsActiveDetail = true;
                    InventoryCustCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCustCtrl.ePage.Masters.dataentryName = "CustomerWarehouseInventory";
                } else if (value == "Product") {
                    InventoryCustCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveProduct = true;
                    InventoryCustCtrl.ePage.Masters.dataentryName = "CustomerInventoryByProduct";
                } else if (value == "Attribute") {
                    InventoryCustCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveLocation = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveAttribute = true;
                    InventoryCustCtrl.ePage.Masters.dataentryName = "CustomerInventoryByAttribute";
                } else if (value == "Location") {
                    InventoryCustCtrl.ePage.Masters.IsActiveDetail = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveProduct = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveAttribute = false;
                    InventoryCustCtrl.ePage.Masters.IsActiveLocation = true;
                    InventoryCustCtrl.ePage.Masters.dataentryName = "CustomerInventoryByLocation";
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                InventoryCustCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentInventory, isNew) {
            InventoryCustCtrl.ePage.Masters.currentInventory = undefined;

            var _isExist = InventoryCustCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentInventory.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                InventoryCustCtrl.ePage.Masters.IsTabClick = true;
                var _currentInventory = undefined;
                if (!isNew) {
                    _currentInventory = currentInventory.entity;
                } else {
                    _currentInventory = currentInventory;
                }

                inventoryConfig.GetTabDetails(_currentInventory, isNew, InventoryCustCtrl.ePage.Masters.dataentryName).then(function (response) {
                    InventoryCustCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {

                        InventoryCustCtrl.ePage.Masters.activeTabIndex = InventoryCustCtrl.ePage.Masters.TabList.length;
                        InventoryCustCtrl.ePage.Masters.CurrentActiveTab(currentInventory.entity.PK);
                        InventoryCustCtrl.ePage.Masters.IsTabClick = false;
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
            InventoryCustCtrl.ePage.Masters.currentInventory = currentTab;
        }

        function RemoveTab(event, index, currentInventory) {
            event.preventDefault();
            event.stopPropagation();
            var currentInventory = currentInventory[currentInventory.label].ePage.Entities;
            InventoryCustCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        Init();
    }

})();	