(function () {
    "use strict"
    angular
        .module("Application")
        .directive("importContainerDetailsGlb", ImportContainerDetailsGlb)
        .directive("importContainerDetailsGlbView", ImportContainerDetailsGlbView);

    function ImportContainerDetailsGlb() {
        var Imports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/my-task/shared/container/import-container-details-glb/import-container-details-glb.html",
            link: Link,
            controller: "ImportContainerDetailsGlbController",
            controllerAs: "ImportContainerDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return Imports;

        function Link(scope, elem, attr) { }
    }

    function ImportContainerDetailsGlbView() {
        var Imports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/container/import-container-details-sea-glb/import-container-details-sea-glb-view.html",
            link: Link,
            controller: "ImportContainerDetailsGlbController",
            controllerAs: "ImportContainerDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return Imports;

        function Link(scope, elem, attr) { }
    }

})();
