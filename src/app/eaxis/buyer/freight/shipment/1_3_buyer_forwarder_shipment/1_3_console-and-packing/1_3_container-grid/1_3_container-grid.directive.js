(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeContainerGrid", oneThreeContainerGrid);

    oneThreeContainerGrid.$inject = [];

    function oneThreeContainerGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_container-grid/1_3_container-grid.html",
            link: Link,
            controller: "oneThreeContainerGridController",
            controllerAs: "oneThreeContainerGridCtrl",
            scope: {
                currentObject: "=",
                btnVisible: "=",
                freightMode: "=",
                readOnly: "=",
                tableProperties: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();