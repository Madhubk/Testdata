(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderController", OrderController);

    OrderController.$inject = ["helperService"];

    function OrderController(helperService) {
        /* jshint validthis: true */
        var OrderCtrl = this;

        function Init() {
            OrderCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Buyer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();