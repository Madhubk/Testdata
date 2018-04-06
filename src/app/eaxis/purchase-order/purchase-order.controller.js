(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PurchaseOrderController", PurchaseOrderController);

    PurchaseOrderController.$inject = ["authService", "helperService"];

    function PurchaseOrderController(authService, helperService) {
        /* jshint validthis: true */
        var PurchaseOrderCtrl = this;

        function Init() {
            PurchaseOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_PurchaseOrder",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PurchaseOrderCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
