(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltchecklist", BupVltChecklist);

    function BupVltChecklist() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-vlt/import-sea-shipment-checklist-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentChecklistVltController",
            controllerAs: "ImportSeaShipmentChecklistVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }

    angular
        .module("Application")
        .directive("importSeaShipmentChecklistVlt", ImportSeaShipmentChecklistVlt);

    function ImportSeaShipmentChecklistVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-checklist-vlt/import-sea-shipment-checklist-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentChecklistVltController",
            controllerAs: "ImportSeaShipmentChecklistVltCtrl",
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
