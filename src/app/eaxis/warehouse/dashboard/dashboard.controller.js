(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseDashboardController", WarehouseDashboardController);

        WarehouseDashboardController.$inject = ["helperService"];

    function WarehouseDashboardController(helperService) {
        var WarehouseDashboardCtrl = this;

        function Init() {
            WarehouseDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse-Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }
        Init();
    }

})();