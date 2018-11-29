(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentCustomToolBar", ShipmentCustomToolBar);

    ShipmentCustomToolBar.$inject = [];

    function ShipmentCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-tool-bar/shipment-tool-bar.html",
            link: Link,
            controller: "ShipmentCustomToolBarController",
            controllerAs: "ShipmentCustomToolBarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();