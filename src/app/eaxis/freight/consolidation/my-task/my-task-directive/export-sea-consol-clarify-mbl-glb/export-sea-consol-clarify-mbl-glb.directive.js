(function () {
    "use strict"
    angular
        .module("Application")
        .directive("clarifymbl", ClarifyMBL)
        .directive("exportSeaConsolClarifyMblGlb", ExportSeaConsolClarifyMBLGlb)

    function ClarifyMBL() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-glb/export-sea-consol-clarify-mbl-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolClarifyMBLGlbController",
            controllerAs: "ExportSeaConsolClarifyMBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolClarifyMBLGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-glb/export-sea-consol-clarify-mbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolClarifyMBLGlbController",
            controllerAs: "ExportSeaConsolClarifyMBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();