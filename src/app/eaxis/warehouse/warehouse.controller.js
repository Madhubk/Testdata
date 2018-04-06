(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseController", WarehouseController);

    WarehouseController.$inject = ["authService", "helperService"];

    function WarehouseController(authService, helperService) {
        /* jshint validthis: true */
        var WarehouseCtrl = this;

        function Init() {
            WarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Warehouse",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            WarehouseCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
