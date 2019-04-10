(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickWithShortfall", PickWithShortfall);

    function PickWithShortfall() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/pick-with-shortfall/pick-with-shortfall.html",
            link: Link,
            controller: "PickShortfallController",
            controllerAs: "PickShortfallCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();