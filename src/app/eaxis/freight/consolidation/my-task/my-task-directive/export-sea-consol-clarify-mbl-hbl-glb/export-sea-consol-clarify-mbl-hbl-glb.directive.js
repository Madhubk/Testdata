(function () {
    "use strict"
    angular
        .module("Application")
        .directive("clarifymblhbl", ClarifyMBLHBL)
        .directive("exportSeaConsolClarifyMblHblGlb", ExportSeaConsolClarifyMBLHBLGlb)

    function ClarifyMBLHBL() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-hbl-glb/export-sea-consol-clarify-mbl-hbl-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolClarifyMBLHBLGlbController",
            controllerAs: "ExportSeaConsolClarifyMBLHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolClarifyMBLHBLGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-clarify-mbl-hbl-glb/export-sea-consol-clarify-mbl-hbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolClarifyMBLHBLGlbController",
            controllerAs: "ExportSeaConsolClarifyMBLHBLGlbCtrl",
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