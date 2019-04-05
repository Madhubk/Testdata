(function () {
    "use strict";

    angular
        .module("Application")
        .directive("grnStatus", grnStatus);

    function grnStatus() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/grn-status/grn-status.html",
            link: Link,
            controller: "GrnStatusController",
            controllerAs: "GrnStatusCtrl",
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