(function () {
    "use strict";

    angular
        .module("Application")
        .directive("routingGrid", Routing);

    Routing.$inject = [];

    function Routing() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/routing-grid/routing-grid.html",
            link: Link,
            controller: "RoutingGridController",
            controllerAs: "RoutingGridCtrl",
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
                type: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();