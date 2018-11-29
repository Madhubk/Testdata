(function () {
    "use strict"
    angular
        .module("Application")
        .directive("consolcreation", ConsolCreation)
        .directive("exportSeaConsolConsolCreationGlb", ExportSeaConsolConsolCreationGlb)

    function ConsolCreation() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-consol-creation-glb/export-sea-consol-consol-creation-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolidationConsolCreationGlbController",
            controllerAs: "ExportSeaConsolidationConsolCreationGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolConsolCreationGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-consol-creation-glb/export-sea-consol-consol-creation-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolidationConsolCreationGlbController",
            controllerAs: "ExportSeaConsolidationConsolCreationGlbCtrl",
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