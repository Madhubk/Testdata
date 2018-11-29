(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportRoutingDetailsGlb", ExportRoutingDetailsGlb)
        .directive("exportRoutingDetailsGlbView", ExportRoutingDetailsGlbView);

    function ExportRoutingDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/shared/routing/export-routing-details-glb/export-routing-details-glb.html",
            link: Link,
            controller: "ExportRoutingDetailsGlbController",
            controllerAs: "ExportRoutingDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportRoutingDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/routing/export-routing-details-sea-glb/export-routing-details-sea-glb-view.html",
            link: Link,
            controller: "ExportRoutingDetailsGlbController",
            controllerAs: "ExportRoutingDetailsGlbCtrl",
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
