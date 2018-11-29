(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerGrid", ContainerGrid);

    ContainerGrid.$inject = [];

    function ContainerGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/console-and-packing/container-grid/container-grid.html",
            link: Link,
            controller: "ContainerGridController",
            controllerAs: "ContainerGridCtrl",
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