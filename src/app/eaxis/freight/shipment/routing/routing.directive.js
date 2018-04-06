(function () {
    "use strict";

    angular
        .module("Application")
        .directive("routing", Routing);

    Routing.$inject = [];

    function Routing() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/routing/routing.html",
            link: Link,
            controller: "RoutingController",
            controllerAs: "RoutingCtrl",
            scope: {
                currentObject: "=",
                keyObjectName: "=",
                fkName: "=",
                pkName: "=",
                apiHeaderName: "=",
                apiHeaderFieldName: "=",
                apiHeaderValueName: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
