(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryViewController", InventoryViewController);

    InventoryViewController.$inject = ["helperService", "inventoryConfig"];

    function InventoryViewController(helperService, inventoryConfig) {
        var InventoryViewCtrl = this;

        function Init() {

            InventoryViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Inventory",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inventoryConfig.Entities
            };
            InventoryViewCtrl.ePage.Masters.taskName = "InventoryView";
            InventoryViewCtrl.ePage.Masters.dataentryName = "InventoryView";
            InventoryViewCtrl.ePage.Masters.IsActiveDetail = true;

            InventoryViewCtrl.ePage.Masters.TabList = [];
            inventoryConfig.TabList = [];
            InventoryViewCtrl.ePage.Masters.activeTabIndex = 0;
            InventoryViewCtrl.ePage.Masters.InventorySummaryDetails = [];

            InventoryViewCtrl.ePage.Masters.IsNewInventoryClicked = false;
            InventoryViewCtrl.ePage.Masters.IsTabClick = false;

        }

        Init();
    }

})();