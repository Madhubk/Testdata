(function () {
    "use strict"
    angular
        .module("Application")
        .directive("amendtaxinv", AmendTaxInv)
        .directive("exportSeaShipmentAmendTaxInvGlb", ExportSeaShipmentAmendTaxInvGlb);

    function AmendTaxInv() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentAmendTaxInvGlbController",
            controllerAs: "ExportSeaShipmentAmendTaxInvGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentAmendTaxInvGlb() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-amend-tax-inv-glb/export-sea-shipment-amend-tax-inv-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentAmendTaxInvGlbController",
            controllerAs: "ExportSeaShipmentAmendTaxInvGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
