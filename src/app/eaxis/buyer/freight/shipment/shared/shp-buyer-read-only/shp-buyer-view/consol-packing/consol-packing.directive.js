(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpBuyerViewConsolPacking", shpBuyerViewConsolPacking);

    shpBuyerViewConsolPacking.$inject = [];

    function shpBuyerViewConsolPacking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/shp-buyer-read-only/shp-buyer-view/consol-packing/consol-packing.html",
            controller: "shpBuyerViewConsolPackingController",
            controllerAs: "shpBuyerViewConsolPackingCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();