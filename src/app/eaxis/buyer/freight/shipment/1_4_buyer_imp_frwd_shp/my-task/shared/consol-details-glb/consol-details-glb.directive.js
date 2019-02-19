(function () {
    "use strict"
    angular
        .module("Application")
        .directive("consolDetailsGlb", ConsolDetailsGlb)
        .directive("consolDetailsGlbView", ConsolDetailsGlbView);

    function ConsolDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/consol-details-glb/consol-details-glb.html",
            link: Link,
            controller: "ConsolDetailsGlbController",
            controllerAs: "ConsolDetailsGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConsolDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/consol-details-glb/consol-details-glb-view.html",
            link: Link,
            controller: "ConsolDetailsGlbController",
            controllerAs: "ConsolDetailsGlbCtrl",
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
