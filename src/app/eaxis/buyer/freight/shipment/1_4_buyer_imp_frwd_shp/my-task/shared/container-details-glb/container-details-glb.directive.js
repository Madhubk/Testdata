(function () {
    "use strict"
    angular
        .module("Application")
        .directive("containerDetailsGlb", ContainerDetailsGlb)
        .directive("containerDetailsGlbView", ContainerDetailsGlbView);

    function ContainerDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/container-details-glb/container-details-glb.html",
            link: Link,
            controller: "ContainerDetailsGlbController",
            controllerAs: "ContainerDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ContainerDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/container-details-glb/container-details-glb-view.html",
            link: Link,
            controller: "ContainerDetailsGlbController",
            controllerAs: "ContainerDetailsGlbCtrl",
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
