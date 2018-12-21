(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpBuyerViewGeneral", shpBuyerViewGeneral);

    shpBuyerViewGeneral.$inject = [];

    function shpBuyerViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view/general/general.html",
            controller: "shpBuyerViewGeneralController",
            controllerAs: "shpBuyerViewGeneralCtrl",
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