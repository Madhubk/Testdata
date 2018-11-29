(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportConsolDetailsSeaGlb", ExportConsolDetailsSeaGlb)
        .directive("exportConsolDetailsSeaGlbView", ExportConsolDetailsSeaGlbView);

    function ExportConsolDetailsSeaGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/consol/export-consol-details-sea-glb/export-consol-details-sea-glb.html",
            link: Link,
            controller: "ExportConsolDetailsSeaGlbController",
            controllerAs: "ExportConsolDetailsSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportConsolDetailsSeaGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/consol/export-consol-details-sea-glb/export-consol-details-sea-glb-view.html",
            link: Link,
            controller: "ExportConsolDetailsSeaGlbController",
            controllerAs: "ExportConsolDetailsSeaGlbCtrl",
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
