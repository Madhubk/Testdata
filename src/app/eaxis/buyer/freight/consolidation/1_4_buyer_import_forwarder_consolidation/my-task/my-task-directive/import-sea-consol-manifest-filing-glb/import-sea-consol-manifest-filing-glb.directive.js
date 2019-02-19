(function () {
    "use strict"
    angular
        .module("Application")
        .directive("manifestfiling", ManifestFiling);

    function ManifestFiling() {
        var imports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-manifest-filing-glb/import-sea-consol-manifest-filing-glb-task-list.html",
            link: Link,
            controller: "ImportSeaConsolManifestFilingGlbController",
            controllerAs: "ImportSeaConsolManifestFilingGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return imports;
        function Link(scope, elem, attr) { }

    }

    angular
        .module("Application")
        .directive("importSeaConsolManifestFilingGlb", ImportSeaConsolManifestFilingGlb);

    function ImportSeaConsolManifestFilingGlb() {
        var imports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-manifest-filing-glb/import-sea-consol-manifest-filing-glb-activity.html",
            link: Link,
            controller: "ImportSeaConsolManifestFilingGlbController",
            controllerAs: "ImportSeaConsolManifestFilingGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return imports;

        function Link(scope, elem, attr) { }
    }
})();
