(function () {
    "use strict"
    angular
        .module("Application")
        .directive("routingDetailsGlb", RoutingDetailsGlb)
        .directive("routingDetailsGlbView", RoutingDetailsGlbView);

    function RoutingDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-details-glb/routing-details-glb.html",
            link: Link,
            controller: "RoutingDetailsGlbController",
            controllerAs: "RoutingDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function RoutingDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/routing-details-glb/routing-details-glb-view.html",
            link: Link,
            controller: "RoutingDetailsGlbController",
            controllerAs: "RoutingDetailsGlbCtrl",
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
