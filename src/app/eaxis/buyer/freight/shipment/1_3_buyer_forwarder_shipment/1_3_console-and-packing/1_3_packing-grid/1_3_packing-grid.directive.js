(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreePackingGrid", oneThreePackingGrid);

    oneThreePackingGrid.$inject = [];

    function oneThreePackingGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid.html",
            link: Link,
            controller: "oneThreePackingGridController",
            controllerAs: "oneThreePackingGridCtrl",
            scope: {
                currentObject: "=",
                gridData: "=?gridData",
                btnVisible: "=",
                freightMode: "=",
                readOnly: "=",
                obj: "=",
                tableProperties: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();