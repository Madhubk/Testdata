(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltchecklistapproval", BupVltChecklistApproval)
        .directive("importSeaShipmentChecklistApprovalVlt", ImportSeaShipmentChecklistApprovalVlt);


    function BupVltChecklistApproval() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-checklist-approval-vlt/import-sea-shipment-checklist-approval-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentChecklistApprovalVltController",
            controllerAs: "ImportSeaShipmentChecklistApprovalVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }


    function ImportSeaShipmentChecklistApprovalVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-checklist-approval-vlt/import-sea-shipment-checklist-approval-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentChecklistApprovalVltController",
            controllerAs: "ImportSeaShipmentChecklistApprovalVltCtrl",
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
