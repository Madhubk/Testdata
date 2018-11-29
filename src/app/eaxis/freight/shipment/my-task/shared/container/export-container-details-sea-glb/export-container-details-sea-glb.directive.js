(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportContainerDetailsSeaGlb", ExportContainerDetailsSeaGlb)
        .directive("exportContainerDetailsSeaGlbView", ExportContainerDetailsSeaGlbView);

    function ExportContainerDetailsSeaGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/container/export-container-details-sea-glb/export-container-details-sea-glb.html",
            link: Link,
            controller: "ExportContainerDetailsSeaGlbController",
            controllerAs: "ExportContainerDetailsSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportContainerDetailsSeaGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/container/export-container-details-sea-glb/export-container-details-sea-glb-view.html",
            link: Link,
            controller: "ExportContainerDetailsSeaGlbController",
            controllerAs: "ExportContainerDetailsSeaGlbCtrl",
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
