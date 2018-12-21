(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gateInGrid", GateInGrid);

    GateInGrid.$inject = [];

    function GateInGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/gate-in-grid/gate-in-grid.html",
            link: Link,
            controller: "GateInGridController",
            controllerAs: "GateInGridCtrl",
            scope: {
                currentObject: "=",
                keyObjectName: "=",
                fkName: "=",
                pkName: "=",
                apiHeaderName: "=",
                apiHeaderFieldName: "=",
                apiHeaderValueName: "=",
                btnVisible: "=",
                tableProperties: "=",
                obj: "=",
                readOnly: "=",
                type: "=",
                readOnlyKey: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();