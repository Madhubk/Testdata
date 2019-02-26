(function () {
    "use strict";

    angular
        .module("Application")
        .directive("billableCost", BillableCost);

    BillableCost.$inject = [];

    function BillableCost() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/billable-cost/billable-cost.html",
            link: Link,
            controller: "BillableCostController",
            controllerAs: "BillableCostCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();