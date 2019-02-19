(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltconfirmarrival", BupVltConfirmArrival);

    function BupVltConfirmArrival() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-confirm-arrival-vlt/import-sea-consol-confirm-arrival-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaConsolConfirmArrivalVltController",
            controllerAs: "ImportSeaConsolConfirmArrivalVltCtrl",
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
        .directive("importSeaConsolConfirmArrivalVlt", ImportSeaConsolConfirmArrivalVlt);

    function ImportSeaConsolConfirmArrivalVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-confirm-arrival-vlt/import-sea-consol-confirm-arrival-vlt-activity.html",
            link: Link,
            controller: "ImportSeaConsolConfirmArrivalVltController",
            controllerAs: "ImportSeaConsolConfirmArrivalVltCtrl",
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
