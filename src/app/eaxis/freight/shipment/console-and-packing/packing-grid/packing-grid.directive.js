(function () {
    "use strict";

    angular
        .module("Application")
        .directive("packingGrid", PackingGrid);

    PackingGrid.$inject = [];

    function PackingGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/console-and-packing/packing-grid/packing-grid.html",
            link: Link,
            controller: "PackingGridController",
            controllerAs: "PackingGridCtrl",
            scope: {
                currentObject: "=",
                gridData: "=",
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

