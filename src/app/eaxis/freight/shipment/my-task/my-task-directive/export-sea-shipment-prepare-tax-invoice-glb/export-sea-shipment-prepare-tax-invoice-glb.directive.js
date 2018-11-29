(function () {
    "use strict"
    angular
        .module("Application")
        .directive("preparetaxinvoice", PrepareTaxInvoice)
        .directive("exportSeaShipmentPrepareTaxInvoiceGlb", ExportSeaShipmentPrepareTaxInvoiceGlb);

    function PrepareTaxInvoice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-tax-invoice-glb/export-sea-shipment-prepare-tax-invoice-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentPrepareTaxInvoiceGlbController",
            controllerAs: "ExportSeaShipmentPrepareTaxInvoiceGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentPrepareTaxInvoiceGlb() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-tax-invoice-glb/export-sea-shipment-prepare-tax-invoice-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentPrepareTaxInvoiceGlbController",
            controllerAs: "ExportSeaShipmentPrepareTaxInvoiceGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "=",
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
