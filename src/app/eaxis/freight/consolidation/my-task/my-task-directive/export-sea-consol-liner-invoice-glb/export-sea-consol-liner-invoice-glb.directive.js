(function () {
    "use strict"
    angular
        .module("Application")
        .directive("linerinvoice", LinerInvoice)
        .directive("exportSeaConsolLinerInvoiceGlb", ExportSeaConsolLinerInvoiceGlb)

    function LinerInvoice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-liner-invoice-glb/export-sea-consol-liner-invoice-glb-task-list-glb.html",
            link: Link,
            controller: "ExportSeaConsolLinerInvGlbController",
            controllerAs: "ExportSeaConsolLinerInvGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolLinerInvoiceGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-liner-invoice-glb/export-sea-consol-liner-invoice-glb-activity-glb.html",
            link: Link,
            controller: "ExportSeaConsolLinerInvGlbController",
            controllerAs: "ExportSeaConsolLinerInvGlbCtrl",
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