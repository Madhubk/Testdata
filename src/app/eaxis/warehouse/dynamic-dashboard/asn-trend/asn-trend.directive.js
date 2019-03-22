(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnTrend", AsnTrend);

    function AsnTrend() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/asn-trend/asn-trend.html",
            link: Link,
            controller: "AsnTrendController",
            controllerAs: "AsnTrendCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();