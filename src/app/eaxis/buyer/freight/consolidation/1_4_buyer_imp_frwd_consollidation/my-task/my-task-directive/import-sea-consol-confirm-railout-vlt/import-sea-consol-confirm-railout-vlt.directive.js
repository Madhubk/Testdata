(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltconfirmrailout", BupVltConfirmRailout);

    function BupVltConfirmRailout() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-railout-vlt/import-sea-consol-confirm-railout-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaConsolConfirmRailoutVltController",
            controllerAs: "ImportSeaConsolConfirmRailoutVltCtrl",
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
        .directive("importSeaConsolConfirmRailoutVlt", ImportSeaConsolConfirmRailoutVlt);

    function ImportSeaConsolConfirmRailoutVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-confirm-railout-vlt/import-sea-consol-confirm-railout-vlt-activity.html",
            link: Link,
            controller: "ImportSeaConsolConfirmRailoutVltController",
            controllerAs: "ImportSeaConsolConfirmRailoutVltCtrl",
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
