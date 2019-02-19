(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltmanifestfiling", BupVltManifestFiling)
        .directive("importSeaConsolManifestFilingVlt", ImportSeaConsolManifestFilingVlt);

    function BupVltManifestFiling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-manifest-filing-vlt/import-sea-consol-manifest-filing-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaConsolManifestFilingVltController",
            controllerAs: "ImportSeaConsolManifestFilingVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }
    function ImportSeaConsolManifestFilingVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-manifest-filing-vlt/import-sea-consol-manifest-filing-vlt-activity.html",
            link: Link,
            controller: "ImportSeaConsolManifestFilingVltController",
            controllerAs: "ImportSeaConsolManifestFilingVltCtrl",
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
