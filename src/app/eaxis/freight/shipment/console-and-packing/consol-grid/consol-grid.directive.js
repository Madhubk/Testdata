(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolGrid", ConsolGrid);

    ConsolGrid.$inject = [];

    function ConsolGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/console-and-packing/consol-grid/consol-grid.html",
            link: Link,
            controller: "ConsolGridController",
            controllerAs: "ConsolGridCtrl",
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