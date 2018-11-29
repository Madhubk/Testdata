(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeConsolGrid", oneThreeConsolGrid);

    oneThreeConsolGrid.$inject = [];

    function oneThreeConsolGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_consol-grid/1_3_consol-grid.html",
            link: Link,
            controller: "oneThreeConsolGridController",
            controllerAs: "oneThreeConsolGridCtrl",
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