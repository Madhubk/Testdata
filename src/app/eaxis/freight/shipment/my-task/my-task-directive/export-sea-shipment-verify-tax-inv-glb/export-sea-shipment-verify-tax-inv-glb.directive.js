(function () {
    "use strict"
    angular
        .module("Application")
        .directive("verifytaxinv", VerifyTaxInv)
        .directive("exportSeaShipmentVerifyTaxInvGlb", ExportSeaShipmentVerifyTaxInvGlb);

    function VerifyTaxInv() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-verify-tax-inv-glb/export-sea-shipment-verify-tax-inv-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentVerifyTaxInvGlbController",
            controllerAs: "ExportSeaShipmentVerifyTaxInvGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentVerifyTaxInvGlb() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-verify-tax-inv-glb/export-sea-shipment-verify-tax-inv-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentVerifyTaxInvGlbController",
            controllerAs: "ExportSeaShipmentVerifyTaxInvGlbCtrl",
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
