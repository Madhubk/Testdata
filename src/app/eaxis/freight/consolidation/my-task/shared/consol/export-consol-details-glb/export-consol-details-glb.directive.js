(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportConsolDetailsGlb", ExportConsolDetailsGlb)
        .directive("exportConsolDetailsGlbView", ExportConsolDetailsGlbView);

    function ExportConsolDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/shared/consol/export-consol-details-glb/export-consol-details-glb.html",
            link: Link,
            controller: "ExportConsolDetailsGlbController",
            controllerAs: "ExportConsolDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportConsolDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/consol/export-consol-details-sea-glb/export-consol-details-sea-glb-view.html",
            link: Link,
            controller: "ExportConsolDetailsGlbController",
            controllerAs: "ExportConsolDetailsGlbCtrl",
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
