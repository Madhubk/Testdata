(function () {
    "use strict"
    angular
        .module("Application")
        .directive("sifiling", SIFiling)
        .directive("exportSeaConsolSiFilingGlb", ExportSeaConsolSiFilingGlb)

    function SIFiling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-si-filing-glb/export-sea-consol-si-filing-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolidationSIFilingGlbController",
            controllerAs: "ExportSeaConsolidationSIFilingGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolSiFilingGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-si-filing-glb/export-sea-consol-si-filing-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolidationSIFilingGlbController",
            controllerAs: "ExportSeaConsolidationSIFilingGlbCtrl",
            bindToController: true,
            scope: {
                CurrentObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();