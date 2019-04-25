(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeInvoice", chargecodeInvoice);

    chargecodeInvoice.$inject = [];

    function chargecodeInvoice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/chargecode/chargecode-invoice/chargecode-invoice.html",
            link: Link,
            controller: "ChargecodeInvoiceController",
            controllerAs: "ChargecodeInvoiceCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();