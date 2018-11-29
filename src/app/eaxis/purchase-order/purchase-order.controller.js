(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PurchaseOrderController", PurchaseOrderController);

    PurchaseOrderController.$inject = ["helperService"];

    function PurchaseOrderController(helperService) {
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
        }

        Init();
    }
})();