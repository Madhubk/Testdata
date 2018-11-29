(function () {
    "use strict"
    angular
        .module("Application")
        .directive("importConsolDetailsSeaGlb", ImportConsolDetailsSeaGlb)
        .directive("importConsolDetailsSeaGlbView", ImportConsolDetailsSeaGlbView);

    function ImportConsolDetailsSeaGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/consol/import-consol-details-sea-glb/import-consol-details-sea-glb.html",
            link: Link,
            controller: "ImportConsolDetailsSeaGlbController",
            controllerAs: "ImportConsolDetailsSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ImportConsolDetailsSeaGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/consol/import-consol-details-sea-glb/import-consol-details-sea-glb-view.html",
            link: Link,
            controller: "ImportConsolDetailsSeaGlbController",
            controllerAs: "ImportConsolDetailsSeaGlbCtrl",
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
