(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderLinesDirectiveController", OrderLinesDirectiveController);

    OrderLinesDirectiveController.$inject = ["helperService"];

    function OrderLinesDirectiveController(helperService) {
        var OrderLinesDirectiveCtrl = this;

        function Init() {
            var currentOrderLines = OrderLinesDirectiveCtrl.currentOrderLines[OrderLinesDirectiveCtrl.currentOrderLines.label].ePage.Entities;
            OrderLinesDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Line_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrderLines
            };

        }

        Init();
    }
})();